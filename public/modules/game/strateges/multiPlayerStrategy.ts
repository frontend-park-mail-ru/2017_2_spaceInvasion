import Strategy from './strategy';
import Player from '../../../models/game/player';
import Bomb from '../../../models/game/sprites/bomb';
import Coin from '../../../models/game/sprites/coin';
import {EVENT, SIDE, RESPAWN_DAMAGE} from '../../../utils/constants';
import User from '../../../models/user';
import SubscriptableMixin from '../../../models/game/mixins/subscriptableMixin';
import StrategyInterface from './strategyInterface';
import emitter from '../../emitter';
import {mapEventDirection, throwIfNull} from '../../../utils/utils';
import Base from '../../../models/game/sprites/base';
import webSocketService from '../../webSockets';
import userService from '../../../services/userService';
import Unit from '../../../models/game/sprites/unit';

class MultiPlayerStrategy extends Strategy implements SubscriptableMixin, StrategyInterface {
  protected me: Player;

  constructor() {
    super();

    // Subscribes
    emitter.attach('Strategy.rollbackEvent', this.rollbackEvent.bind(this)); // event: number[]
  }

  startGameLoop() {
    this.webSocketsInit();
    super.startGameLoop();
  }

  private webSocketsInit(): void {
    // Registration
    webSocketService.subscribe('JoinApproved', this.onJoinApproved.bind(this));
    webSocketService.subscribe('NewUser', this.onNewUser.bind(this));

    // Common events
    webSocketService.subscribe('BombBoom', this.onBombBoom.bind(this));
    webSocketService.subscribe('Damage', this.onDamage.bind(this));

    // My events
    webSocketService.subscribe('Rollback', webSocketService.rollback.bind(webSocketService));
    webSocketService.subscribe('CollectMoney', this.me.reward.bind(this.me));

    // OpponentEvents
    const opponent = this.state.players.filter(p => p !== this.me)[0];
    webSocketService.subscribe('OpponentMove', opponent.unit.move.bind(opponent.unit));
    webSocketService.subscribe('OpponentShot', opponent.unit.shout.bind(opponent.unit));
    webSocketService.subscribe('OpponentCollectMoney', opponent.reward.bind(opponent));
  }

  private onBombBoom(event: MessageEvent): void {
    const targetID = event.data[0];
    const bomb = this.state.bombs.filter(bomb => bomb.id === targetID)[0];
    bomb.destroy();
  }

  private onDamage(event: MessageEvent): void {
    const targetID = event.data[0];
    const sourceID = event.data[1];

    const bullet = this.state.bullets.filter(b => b.id === sourceID)[0];
    try {
      emitter.emit('Tower.damage.' + targetID, bullet.getDamage());
      emitter.emit('Unit.damage.' + targetID, bullet.getDamage());
    } catch {}
  }

  private onJoinApproved(event: MessageEvent): void {
    const unitID: number = event.data[0];
    const side: SIDE = event.data[1] === 'man' ? SIDE.MAN : SIDE.ALIEN;

    const user = throwIfNull(userService.user);
    this.me = this.addNewUser(unitID, user, side);
  }

  private onNewUser(event: MessageEvent): void {
    const unitID: number = event.data[0];
    const username: string = event.data[1];
    const email: string = event.data[2];
    const score: number = event.data[3];
    const user = new User(username, email, '');
    user.score = score;

    this.addNewUser(unitID, user, event.data[4] === 'man' ? SIDE.MAN : SIDE.ALIEN);
  }

  private addNewUser(unitID: number, user: User, side: SIDE): Player {
    const player = new Player(user, new Unit(unitID, side));
    this.state.players.push(player);
    this.state.bases.push(new Base(unitID, side));
    this.state.units.push(player.unit);

    emitter.emit('GameService.join', user, side);
    if (this.state.players.length === 2) {
      this.startGameLoop();
    }

    return player;
  }

  private rollbackEvent(event: number[]): void {
    // TODO: Handle all types of events
    switch (event[0]) {
      case 0:
        this.me.unit.move(360 - event[1]);
        break;
      default:
        throw Error('Internal Error')
    }
  }

  onNewCommand(...data: any[]): void {
    const command = data[0] as EVENT;
    switch (command) {
      case EVENT.FIRE:
        emitter.emit('Player.shout.' + this.me.unit.id);
        webSocketService.send([]); // TODO: send anything
        break;
      case EVENT.TOWER:
        emitter.emit('Player.setTower.' + this.me.unit.id);
        webSocketService.send([]); // TODO: send anything
        break;
      case EVENT.DOWN:
      case EVENT.UP:
      case EVENT.LEFT:
      case EVENT.RIGHT:
        emitter.emit(
          'Player.setDirection.' + this.me.unit.id,
          this.me.unit.getDirection() || 0 + throwIfNull(mapEventDirection(command))
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
    switch (command) {
      case EVENT.LEFT:
      case EVENT.RIGHT:
      case EVENT.DOWN:
      case EVENT.UP:
        // Cancel moving by this direction
        emitter.emit(
          'Player.setDirection.' + this.me.unit.id,
          this.me.unit.getDirection() || 0 - throwIfNull(mapEventDirection(command))
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
    debugger;
    return Boolean(this.me);
  }

  gameLoop(): void {
    // Движение пуль и обработка пуль, вышедших за пределы поля
    this.state.bullets.forEach(blt => {
      blt.move();
      if (
        blt.getCoords().x + blt.getWidth() / 2 <= 0 ||
        blt.getCoords().x - blt.getWidth() / 2 >= this.width ||
        blt.getCoords().y + blt.getHeight() / 2 <= 0 ||
        blt.getCoords().y - blt.getHeight() / 2 >= this.height
      ) {
        blt.destroy();
      }
    });

    // Движение игроков
    this.state.units.forEach(unit => unit.move());

    // Установка бомб
    this.state.bases.filter(base => base.isUnderAttack()).forEach(
      base => {
        const bomb = new Bomb(this.state.bombs.length, base);
        bomb.cancelDestruction();
        this.state.bombs.push(bomb);
      }
    );

    // За каждую убитую башню добавить монетки
    this.state.towers.filter(tower => !tower.alive()).forEach(tower => {
      this.state.coins.push(new Coin(this.state.coins.length, tower.getCoords()));
    });

    // Если умирает юнит, респавним его и дамажим его дом
    this.state.units.filter(unit => !unit.alive()).forEach(unit => {
      unit.spawn();
      this.state.bases.filter(base => base.side === unit.side)[0].damage(RESPAWN_DAMAGE);
    });

    // Удаляем пропавшие пули
    this.state.bullets = this.state.bullets.filter(blt => blt.visible);

    // Удаляем пропавшие башни
    this.state.towers = this.state.towers.filter(tower => tower.alive());

    // Удаляем пропавшие монетки
    this.state.coins = this.state.coins.filter(coin => coin.visible);
  }

  destroy(): void {
    this.state.destroy();
    this.stopGameLoop();
  }
}

export default MultiPlayerStrategy;
