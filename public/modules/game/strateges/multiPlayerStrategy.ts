import Strategy from './strategy';
import Player from '../../../models/game/player';
import Bomb from '../../../models/game/sprites/bomb';
import Coin from '../../../models/game/sprites/coin';
import {EVENT, SIDE, RPS} from '../../../utils/constants';
import User from '../../../models/user';
import SubscriptableMixin from '../../../models/game/mixins/subscriptableMixin';
import StrategyInterface from './strategyInterface';
import emitter from '../../emitter';
import {getCodeByDir, mapEventDirection, subDirs, sumDirs, throwIfNull} from '../../../utils/utils';
import Base from '../../../models/game/sprites/base';
import webSocketService from '../../../services/webSockets';
import {default as userService, UserService} from '../../../services/userService';
import Unit from '../../../models/game/sprites/unit';
import Coords from '../../../models/game/coords';
import GameState from "../../../models/game/state";

class MultiPlayerStrategy extends Strategy implements SubscriptableMixin, StrategyInterface {
  protected me: Player;
  protected sendedState = new GameState();
  protected timer: number;

  constructor() {
    super();
    this.webSocketsInit();

    // Subscribes
    this.subscribe('Strategy.rollbackEvent', this.rollbackEvent.bind(this)); // event: string
  }

  startGameLoop(): void {
    if (!this.running) {
      this.timer = setInterval(this.sendToServer.bind(this), 1000 / RPS);
    }
    super.startGameLoop();
  }

  protected sendToServer(): void {
    const me = this.sendedState.players.filter(p => p.unit.side === this.me.unit.side)[0];
    if (me && (this.me.unit.getCoords().x !== me.unit.getCoords().x || this.me.unit.getCoords().y !== me.unit.getCoords().y)) {
      webSocketService.send({
        class: 'ClientSnap',
        request: [
          this.lastID++,
          0,
          this.me.unit.getCoords().x - me.unit.getCoords().x,
          this.me.unit.getCoords().y - me.unit.getCoords().y,
        ]
      });
    }
    this.sendedState = GameState.copy(this.state);
  }

  private webSocketsInit(): void {
    // Registration
    webSocketService.subscribe(7, this.onJoinApproved.bind(this));
    // webSocketService.subscribe('NewUser', this.onNewUser.bind(this));

    // Common events
    // webSocketService.subscribe('BombBoom', this.onBombBoom.bind(this));
    // webSocketService.subscribe('Damage', this.onDamage.bind(this));

    // My events
    // webSocketService.subscribe('Rollback', webSocketService.rollback.bind(webSocketService));
    // webSocketService.subscribe('CollectMoney', this.me.reward.bind(this.me));

    // OpponentEvents
    webSocketService.subscribe(3, this.onMove.bind(this));
    // webSocketService.subscribe('OpponentShot', opponent.unit.shout.bind(opponent.unit));
    // webSocketService.subscribe('OpponentCollectMoney', opponent.reward.bind(opponent));
  }

  private onMove(data: any): void {
    const opponent = this.state.players.filter(p => p !== this.me)[0];
    if (opponent !== undefined) {
      opponent.unit.correctCoords(new Coords(data[0], data[1]));
    }
  }

  private onBombInstall(event: MessageEvent): void {

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
    } catch {
    }
  }

  private onJoinApproved(data: any): void {
    const side: SIDE = data[0] === 0 ? SIDE.MAN : SIDE.ALIEN;
    const enemyID = data[1];
    const oppositeSide = side === SIDE.ALIEN ? SIDE.MAN : SIDE.ALIEN;

    UserService.getUser(enemyID).then(enemy => {
      const user = throwIfNull(userService.user);
      this.me = this.addNewUser(user, side);
      this.addNewUser(enemy, oppositeSide);
    }).catch(() => {
      // TODO
    });
  }

  private addNewUser(user: User, side: SIDE): Player {
    const id = user.id || 0;
    console.log(id);
    const player = new Player(user, new Unit(id, side));
    this.state.players.push(player);
    this.state.bases.push(new Base(id, side));
    this.state.units.push(player.unit);

    // emitter.emit('Game.join', user, side);
    if (this.state.players.length === 2) {
      this.startGameLoop();
    }

    return player;
  }

  private rollbackEvent(event: any): void {
    // TODO: Handle all types of events
    const coords = new Coords(-event[1], -event[2]);
    switch (event[0]) {
      case 0:
        this.me.unit.move(coords);
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
        webSocketService.send({class: 'ClientSnap', request: [this.lastID++, 3, getCodeByDir(this.me.unit.getDirection())]}); // TODO: send anything
        break;
      case EVENT.TOWER:
        emitter.emit('Player.setTower.' + this.me.unit.id);
        webSocketService.send({class: 'ClientSnap', request: [this.lastID++, 1, getCodeByDir(this.me.unit.getDirection())]}); // TODO: send anything
        break;
      case EVENT.DOWN:
      case EVENT.UP:
      case EVENT.LEFT:
      case EVENT.RIGHT:
        emitter.emit(
          'Player.setDirection.' + this.me.unit.id,
          sumDirs(this.me.unit.getDirection(), mapEventDirection(command)),
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
          subDirs(this.me.unit.getDirection(), mapEventDirection(command)),
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
    webSocketService.send({class:'JoinRequest'});
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
    this.state.units.forEach(unit => {
      unit.move();
    });

    // Установка бомб
    this.state.bases.filter(base => base.underAttack).forEach(
      base => {
        const bomb = new Bomb(this.lastID++, base);
        bomb.cancelDestruction();
        this.state.bombs.push(bomb);
      }
    );

    // За каждую убитую башню добавить монетки
    this.state.towers.filter(tower => !tower.alive()).forEach(tower => {
      this.state.coins.push(new Coin(this.lastID++, tower.getCoords()));
    });

    // Если умирает юнит, респавним его
    this.state.units.filter(unit => !unit.alive()).forEach(unit => unit.spawn());

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
      emitter.emit('Game.onFinishGame', deadBases[0].side !== this.me.unit.side);
      return;
    }
  }
}

export default MultiPlayerStrategy;
