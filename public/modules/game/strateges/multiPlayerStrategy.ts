import Strategy from './strategy';
import Player from '../../../models/game/player';
import Tower from '../../../models/game/sprites/tower';
import Bomb from '../../../models/game/sprites/bomb';
import Coin from '../../../models/game/sprites/coin';
import Coords from '../../../models/game/coords';
import {EVENT, SIDE, TEAM} from '../../../utils/constants';
import Unit from '../../../models/game/sprites/unit';
import User from '../../../models/user';
import SubscriptableMixin from '../../../models/game/mixins/subscriptableMixin';
import StrategyInterface from './strategyInterface';
import Bot from '../../../models/game/sprites/bot';
import emitter from '../../emitter';
import collisionService from '../../../services/collisionService';
import {mapEventDirection, throwIfNull} from '../../../utils/utils';
import Base from '../../../models/game/sprites/base';
import webSocketService from '../../webSockets';

class MultiPlayerStrategy extends Strategy implements SubscriptableMixin, StrategyInterface {
  protected me: Player;

  onNewCommand(...data: any[]): void {
    const command = data[0] as EVENT;
    const me = this.state.players.filter(user => !(user.unit instanceof Bot))[0];
    switch (command) {
      case EVENT.FIRE:
        emitter.emit('Player.shout.' + me.unit.id);
        webSocketService.send([]); // TODO: send anything
        break;
      case EVENT.TOWER:
        emitter.emit('Player.setTower.' + me.unit.id);
        webSocketService.send([]); // TODO: send anything
        break;
      case EVENT.DOWN:
      case EVENT.UP:
      case EVENT.LEFT:
      case EVENT.RIGHT:
        emitter.emit(
          'Player.setDirection.' + me.unit.id,
          me.unit.getDirection() || 0 + throwIfNull(mapEventDirection(command))
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
    const user: User = data[0];
    const side: SIDE = data[1];
    webSocketService.send([]); // TODO: send anything

    this.me = waitServer();
    this.state.players.push(this.me);
    this.state.bases.push(new Base(this.me.unit.id, this.me.unit.side));
    this.state.units.push(this.me.unit);

    this.startGameLoop();
    return this.state.players.length === 2;
  }

  gameLoop() {
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
      base => this.state.bombs.push(new Bomb(this.state.bombs.length, base))
    );

    // Запускаем обработчик коллизий
    this.handleCollisions();

    // За каждую убитую башню добавить монетки
    this.state.towers.filter(tower => !tower.alive()).forEach(tower => {
      this.state.coins.push(new Coin(this.state.coins.length, tower.getCoords()));
    });

    // Если умирает юнит, респавним его и дамажим его дом
    this.state.units.filter(unit => !unit.alive()).forEach(unit => {
      unit.spawn();
      debugger;
      if (!(unit instanceof Bot)) {
        this.state.bases.filter(base => base.side === unit.side)[0].damage(1);
      }
    });

    // Удаляем пропавшие пули
    this.state.bullets = this.state.bullets.filter(blt => blt.visible);

    // Удаляем пропавшие башни
    this.state.towers = this.state.towers.filter(tower => tower.alive());

    // Удаляем пропавшие монетки
    this.state.coins = this.state.coins.filter(coin => coin.visible);

    // Проверяем, не закончилась ли игра
    const deadBases = this.state.bases.filter(base => !base.alive());
    if (deadBases.length > 0) {
      this.funcFinishGame(
        deadBases[0].side === this.state.units.filter(unit => unit instanceof Bot)[0].side
      );
      this.stopGameLoop();
      return;
    }
  }

  destroy() {
    this.state.destroy();
    this.stopGameLoop();
  }

  private handleCollisions(): void {
    collisionService.append(
      ...this.state.bases,
      ...this.state.units,
      ...this.state.coins,
      ...this.state.towers,
      ...this.state.bombs,
      ...this.state.bullets
    );
    collisionService.run();
    collisionService.clear();
  }
}

export default MultiPlayerStrategy;
