import Strategy from './strategy';
import Player from '../../../models/game/player';
import Tower from '../../../models/game/sprites/tower';
import Bomb from '../../../models/game/sprites/bomb';
import Coin from '../../../models/game/sprites/coin';
import Coords from '../../../models/game/coords';
import {EVENT, SIDE, TEAM, RESPAWN_DAMAGE, BOT} from '../../../utils/constants';
import Unit from '../../../models/game/sprites/unit';
import User from '../../../models/user';
import SubscriptableMixin from '../../../models/game/mixins/subscriptableMixin';
import StrategyInterface from './strategyInterface';
import Bot from '../../../models/game/sprites/bot';
import emitter from '../../emitter';
import collisionService from '../../../services/collisionService';
import {getEventsByDir, getOtherSide, mapEventDirection, subDirs, sumDirs} from '../../../utils/utils';
import Base from '../../../models/game/sprites/base';

class SinglePlayerStrategy extends Strategy implements SubscriptableMixin, StrategyInterface {
  onNewCommand(...data: any[]): void {
    const command = data[0] as EVENT;
    const me = this.state.players.filter(user => !(user.unit instanceof Bot))[0];
    switch (command) {
      case EVENT.FIRE:
        emitter.emit('Player.shout.' + me.unit.id);
        break;
      case EVENT.TOWER:
        emitter.emit('Player.setTower.' + me.unit.id);
        break;
      case EVENT.DOWN:
      case EVENT.UP:
      case EVENT.LEFT:
      case EVENT.RIGHT:
        emitter.emit(
          'Player.setDirection.' + me.unit.id,
          sumDirs(me.unit.getDirection(), mapEventDirection(command))
        );
        break;
      case EVENT.NO:
        break;
      default:
        throw Error('Action is not support by SinglePlayerStrategy');
    }
  }

  onStopCommand(...data: any[]): void {
    const command = data[0] as EVENT;
    const me = this.state.players.filter(user => !(user.unit instanceof Bot))[0];
    switch (command) {
      case EVENT.LEFT:
      case EVENT.RIGHT:
      case EVENT.DOWN:
      case EVENT.UP:
        // Cancel moving by this direction
        emitter.emit(
          'Player.setDirection.' + me.unit.id,
          subDirs(me.unit.getDirection(), mapEventDirection(command))
        );
        break;
      case EVENT.FIRE:
      case EVENT.TOWER:
      case EVENT.NO:
        // Do nothing
        break;
      default:
        throw Error('Action is not support by SinglePlayerStrategy');
    }
  }

  join(...data: any[]): boolean {
    const user: User = data[0];
    const side: SIDE = data[1];
    const oppositeSide = getOtherSide(side);

    this.state.players.push(new Player(user, new Unit(this.lastID += 2, side)));
    this.state.players.push(new Player(new User(this.lastID += 2, 'Bot', TEAM.EMAIL, '********'),
      new Bot(this.lastID += 2, oppositeSide)));
    this.state.players.forEach(p => {
      this.state.bases.push(new Base(p.unit.id, p.unit.side));
      this.state.units.push(p.unit)
    });

    // Две башни противника уже стоят
    const oppositeDir = oppositeSide === SIDE.MAN ? new Coords(-1, 0) : new Coords(1, 0);
    const oppositeX = oppositeSide === SIDE.MAN ? BOT.TOWER_OFFSET : this.width - BOT.TOWER_OFFSET;
    this.state.towers.push(new Tower(this.lastID += 2, new Coords(oppositeX, 120), oppositeDir, oppositeSide));
    this.state.towers.push(new Tower(this.lastID += 2, new Coords(oppositeX, 400), oppositeDir, oppositeSide));

    this.startGameLoop();
    return true;
  }

  gameLoop(): void {
    const me = this.state.units.filter(u => !(u instanceof Bot))[0];

    // Движение пуль
    this.state.bullets.forEach(blt => {
      blt.move();
    });

    // Движение игроков
    const myPreveousSpeed = me.getSpeed();
    this.state.units.forEach(unit => {
      unit.move();
    });

    // Включаем игнор клавиш, если юнит упёрся в стену
    if (me.getSpeed() === 0 && myPreveousSpeed !== 0) {
      getEventsByDir(me.getDirection())
        .forEach(event => emitter.emit('Game.undoAction', event));
    }

    // Установка бомб
    this.state.bases.filter(base => base.underAttack).forEach(
      base => {
        if (!this.state.bombs.some(bomb => bomb.target.id === base.id)) {
          this.state.bombs.push(new Bomb(this.lastID += 2, base))
        }
      }
    );

    // Запускаем обработчик коллизий
    this.handleCollisions();

    // За каждую убитую башню добавить монетки
    this.state.towers.filter(tower => !tower.alive()).forEach(tower => {
      this.state.coins.push(new Coin(this.lastID += 2, tower.getCoords()));
    });

    // Если умирает юнит, респавним его и дамажим его дом
    this.state.units.filter(unit => !unit.alive()).forEach(unit => {
      unit.spawn();
      if (!(unit instanceof Bot)) {
        this.state.bases.filter(base => base.side === unit.side)[0].damage(RESPAWN_DAMAGE);
      }
    });

    // Удаляем пропавшие пули
    this.state.bullets = this.state.bullets.filter(blt => blt.visible);

    // Удаляем пропавшие башни
    this.state.towers = this.state.towers.filter(tower => tower.alive());

    // Удаляем пропавшие монетки
    this.state.coins = this.state.coins.filter(coin => coin.visible);

    // Удаляем пропавшие бомбы
    this.state.bombs = this.state.bombs.filter(bomb => bomb.visible);

    // Проверяем, не закончилась ли игра
    const deadBases = this.state.bases.filter(base => !base.alive());
    if (deadBases.length > 0) {
      emitter.emit('Game.onFinishGame',
        deadBases[0].side === this.state.units.filter(unit => unit instanceof Bot)[0].side
      );
      return;
    }
  }

  private handleCollisions(): void {
    collisionService.append(
      ...this.state.bases,
      ...this.state.units,
      ...this.state.coins,
      ...this.state.towers,
      ...this.state.bullets
    );
    collisionService.run();
    collisionService.clear();
  }
}

export default SinglePlayerStrategy;
