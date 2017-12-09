import Strategy from './strategy';
import Player from '../../../models/game/player';
import Bomb from '../../../models/game/sprites/bomb';
import Coin from '../../../models/game/sprites/coin';
import {EVENT, SIDE, RPS} from '../../../utils/constants';
import User from '../../../models/user';
import SubscriptableMixin from '../../../models/game/mixins/subscriptableMixin';
import StrategyInterface from './strategyInterface';
import emitter from '../../emitter';
import {
  getCodeByDir, getDirByCode, getEventsByCode, getEventsByDir, getOtherSide, mapEventDirection, subDirs, sumDirs,
  throwIfNull
} from '../../../utils/utils';
import Base from '../../../models/game/sprites/base';
import webSocketService from '../../../services/webSockets';
import {default as userService, UserService} from '../../../services/userService';
import Unit from '../../../models/game/sprites/unit';
import Coords from '../../../models/game/coords';
import GameState from '../../../models/game/state';
import collisionService from '../../../services/collisionService';
import Tower from '../../../models/game/sprites/tower';
import Bullet from '../../../models/game/sprites/bullet';

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
    // Get whole state from server
    // webSocketService.subscribe(0, this.setState.bind(this)); // Update state from server

    // 1 - Rollback обрабатывается по другой механике

    // Common events
    webSocketService.subscribe(2, this.onCollision.bind(this)); // Collision

    // Opponent events
    webSocketService.subscribe(3, this.onMove.bind(this)); // Move
    webSocketService.subscribe(4, this.onTower.bind(this)); // Tower
    webSocketService.subscribe(5, this.onBombInstall.bind(this)); // Bomb Installed
    webSocketService.subscribe(6, this.onShout.bind(this)); // Shout
    // webSocketService.subscribe(8, this.onChangeCache.bind(this)); // Coins

    // Registration
    webSocketService.subscribe(7, this.onJoinApproved.bind(this)); // Join
  }

  private onShout(data: any): void {
    const x = data[0];
    const y = data[1];
    const dirCode = data[2];

    this.state.bullets.push(
      new Bullet(
        this.lastID++,
        getDirByCode(dirCode),
        new Coords(x, y)
      )
    );
  }

  private onTower(data: any): void {
    const x = data[0];
    const y = data[1];
    const dirCode = data[2];

    this.state.towers.push(
      new Tower(
        this.lastID++,
        new Coords(x, y),
        getDirByCode(dirCode),
        getOtherSide(this.me.unit.side)
      )
    );
  }

  private onChangeCache(data: any): void {
    const ID = data[0];
    const coins = data[1];
    const player = this.state.players.filter(p => p.unit.id === ID)[0];
    player.reward(coins - player.coins);
  }

  private onMove(data: any): void {
    const opponent = this.state.players.filter(p => p !== this.me)[0];
    if (opponent !== undefined) {
      opponent.unit.correctCoords(new Coords(data[0], data[1]));
    }
  }

  private onBombInstall(data: any): void {
    const ID = data[0];
    this.state.bombs.push(
      new Bomb(
        ID,
        this.state.bases.filter(b => b.side === this.me.unit.side)[0]
      )
    )
  }

  private onBombBoom(data: any): void {
    const targetID = data[0];
    const bomb = this.state.bombs.filter(bomb => bomb.id === targetID)[0];
    bomb.destroy();
  }

  private onCollision(data: any): void {
    const sprite1 = this.state.findSpriteByID(data[0]);
    const sprite2 = this.state.findSpriteByID(data[1]);

    if (sprite1 && sprite2) {
      if (sprite1 instanceof Bomb) {
        this.onBombBoom([sprite2.id]);
        return;
      }
      if (sprite2 instanceof  Bomb) {
        this.onBombBoom([sprite1.id]);
        return;
      }
      collisionService.append(sprite1, sprite2);
      collisionService.run();
    }
  }

  private onJoinApproved(data: any): void {
    const side: SIDE = data[0] === 0 ? SIDE.MAN : SIDE.ALIEN;
    const enemyID = data[1];

    UserService.getUser(enemyID).then(enemy => {
      const user = throwIfNull(userService.user);
      this.me = this.addNewUser(user, side);
      this.addNewUser(enemy, getOtherSide(side));
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
    switch (event[0]) {
      case 0: // Move
        const coords = new Coords(-event[1], -event[2]);
        this.me.unit.correctCoords(coords);
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
        webSocketService.send({
          class: 'ClientSnap',
          request: [
            this.lastID++,
            3, // Shout
            getCodeByDir(this.me.unit.getDirection())
          ]
        });
        break;
      case EVENT.TOWER:
        emitter.emit('Player.setTower.' + this.me.unit.id);
        webSocketService.send({
          class: 'ClientSnap',
          request: [
            this.lastID++,
            1, // Tower
            getCodeByDir(this.me.unit.getDirection())
          ]
        });
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
    // Движение пуль
    this.state.bullets.forEach(blt => {
      blt.move();
    });

    // Движение игроков
    const myPreveousSpeed = this.me.unit.getSpeed();
    this.state.units.forEach(unit => {
      unit.move();
    });

    // Включаем игнор клавиш, если юнит упёрся в стену
    if (this.me.unit.getSpeed() === 0 && myPreveousSpeed !== 0) {
      getEventsByDir(this.me.unit.getDirection())
        .forEach(event => emitter.emit('Game.undoAction', event));
    }

    // Установка бомб
    this.state.bases.filter(base => base.underAttack).forEach(
      base => {
        webSocketService.send({
          class: 'ClientSnap',
          request: [
            this.lastID++,
            2 // Bomb
          ]
        });
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
