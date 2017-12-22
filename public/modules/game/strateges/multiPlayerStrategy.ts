import Strategy from './strategy';
import Player from '../../../models/game/player';
import Bomb from '../../../models/game/sprites/bomb';
import Coin from '../../../models/game/sprites/coin';
import {EVENT, SIDE, RPS} from '../../../utils/constants';
import SubscriptableMixin from '../../../models/game/mixins/subscriptableMixin';
import StrategyInterface from './strategyInterface';
import emitter from '../../emitter';
import {
  getCodeByDir, getDirByCode, getEventsByDir, getOtherSide, mapEventDirection, subDirs, sumDirs,
  throwIfNull
} from '../../../utils/utils';
import Base from '../../../models/game/sprites/base';
import webSocketService from '../../../services/webSockets';
import {default as userService, UserService} from '../../../services/userService';
import Unit from '../../../models/game/sprites/unit';
import Coords from '../../../models/game/coords';
import GameState from '../../../models/game/state';
import Tower from '../../../models/game/sprites/tower';
import Bullet from '../../../models/game/sprites/bullet';

class MultiPlayerStrategy extends Strategy implements SubscriptableMixin, StrategyInterface {
  protected sendedState = new GameState();
  protected timer: number;
  private mySide: SIDE;
  private joinedUserIDs: Map<number, number> = new Map;

  constructor() {
    super();
    this.webSocketsInit();

    // Subscribes
    this.subscribe('Strategy.rollbackEvent', this.rollbackEvent.bind(this)); // event: string
    this.subscribe('Strategy.lastID', () => this.lastID); // event: string
  }

  destroy(): void {
    webSocketService.destroy();
  }

  startGameLoop(): void {
    if (!this.running) {
      this.timer = setInterval(this.sendToServer.bind(this), 1000 / RPS);
    }
    super.startGameLoop();
  }

  stopGameLoop(): void {
    if (this.running) {
      clearInterval(this.timer);
    }
    super.stopGameLoop();
  }

  onNewCommand(...data: any[]): void {
    const me = this.state.players.filter(p => p.unit.side === this.mySide)[0];
    const command = data[0] as EVENT;
    switch (command) {
      case EVENT.FIRE:
        emitter.emit('Player.shout.' + me.unit.id);
        this.sendToServer();
        webSocketService.send({
          class: 'ClientSnap',
          request: [
            this.lastID,
            3, // Shout
            getCodeByDir(me.unit.getDirection())
          ]
        });
        break;
      case EVENT.TOWER:
        emitter.emit('Player.setTower.' + me.unit.id);
        if (me.unit.onHisHalf()) {
          this.sendToServer();
          webSocketService.send({
            class: 'ClientSnap',
            request: [
              this.lastID,
              1, // Tower
              getCodeByDir(me.unit.getDirection())
            ]
          });
        }
        break;
      case EVENT.DOWN:
      case EVENT.UP:
      case EVENT.LEFT:
      case EVENT.RIGHT:
        emitter.emit(
          'Player.setDirection.' + me.unit.id,
          sumDirs(me.unit.getDirection(), mapEventDirection(command)),
        );
        break;
      case EVENT.NO:
        break;
      default:
        throw Error('Action is not support by SinglePlayerStrategy');
    }
  }

  onStopCommand(...data: any[]): void {
    const me = this.state.players.filter(p => p.unit.side === this.mySide)[0];
    const command = data[0] as EVENT;
    switch (command) {
      case EVENT.LEFT:
      case EVENT.RIGHT:
      case EVENT.DOWN:
      case EVENT.UP:
        // Cancel moving by this direction
        emitter.emit(
          'Player.setDirection.' + me.unit.id,
          subDirs(me.unit.getDirection(), mapEventDirection(command)),
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
    webSocketService.send({class: 'JoinRequest'});
    return false;
  }

  gameLoop(): void {
    const me = this.state.players.filter(p => p.unit.side === this.mySide)[0];
    const opponent = this.state.players.filter(p => p.unit.side === this.mySide)[0];

    // Движение пуль
    this.state.bullets.forEach(blt => {
      blt.move();
    });

    // Движение игроков
    const myPreveousSpeed = me.unit.getSpeed();
    this.state.units.forEach(unit => {
      unit.move();
    });

    // Включаем игнор клавиш, если юнит упёрся в стену
    if (me.unit.getSpeed() === 0 && myPreveousSpeed !== 0) {
      getEventsByDir(me.unit.getDirection())
        .forEach(event => emitter.emit('Game.undoAction', event));
    }

    // Установка бомб
    this.state.bases.filter(base => base.underAttack).forEach(
      base => {
        const bomb = new Bomb(this.lastID += 2, base);
        bomb.cancelDestruction();
        this.state.bombs.push(bomb);
        webSocketService.send({
          class: 'ClientSnap',
          request: [
            this.lastID,
            2 // Bomb
          ]
        });
      }
    );

    // Удаляем пропавших юнитов
    this.state.units = this.state.units.filter(u => u.alive());

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
      emitter.emit('Game.onFinishGame', deadBases[0].side !== this.mySide);
      return;
    }
  }

  protected sendToServer(): void {
    const me = this.sendedState.players.filter(p => p.unit.side === this.mySide)[0];
    const newMe = this.state.players.filter(p => p.unit.side === this.mySide)[0];

    if (me && (newMe.unit.getCoords().x !== me.unit.getCoords().x || newMe.unit.getCoords().y !== me.unit.getCoords().y)) {
      webSocketService.send({
        class: 'ClientSnap',
        request: [
          this.lastID += 2,
          0,
          newMe.unit.getCoords().x - me.unit.getCoords().x,
          newMe.unit.getCoords().y - me.unit.getCoords().y,
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
    webSocketService.subscribe(11, this.onCoinSpawned.bind(this)); // Coin spawned
    webSocketService.subscribe(12, () => {
    }); // Ping

    // Opponent events
    webSocketService.subscribe(3, this.onMove.bind(this)); // Move
    webSocketService.subscribe(4, this.onTower.bind(this)); // Tower
    webSocketService.subscribe(5, this.onBombInstall.bind(this)); // Bomb Installed
    webSocketService.subscribe(6, this.onShout.bind(this)); // Shout

    // Registration
    webSocketService.subscribe(7, this.onJoinApproved.bind(this)); // Join
    webSocketService.subscribe(10, this.onNewUnitCreated.bind(this)); // Join
  }

  private onNewUnitCreated(data: any): void {
    const userID = data[0];
    const unitID = data[1];
    if (!this.running) {
      this.joinedUserIDs.set(userID, unitID);
      this.tryToStartGameLoop();
    } else {
      const playerId = this.state.players.findIndex(p => p.user.id === userID);
      const unit = new Unit(unitID, this.state.players[playerId].unit.side);
      const oldPlayer = this.state.players[playerId];
      if (oldPlayer.unit.visible) {
        oldPlayer.unit.destroy();
      }
      oldPlayer.destroy();
      this.state.players[playerId] = new Player(
        this.state.players[playerId].user,
        unit
      );
      this.state.players[playerId].reward(oldPlayer.coins - this.state.players[playerId].coins);
      this.state.units.push(unit);
    }
  }

  private onCoinSpawned(data: any): void {
    const x = data[0];
    const y = data[1];
    const ID = data[2];

    this.state.coins.push(
      new Coin(
        ID,
        new Coords(x, y)
      )
    );
  }

  private tryToStartGameLoop(): void {
    if (this.joinedUserIDs.size === 2 && this.state.users.length === 2) {
      this.state.users.forEach(u => {
        const unitID = this.joinedUserIDs.get(u.id);
        if (unitID === undefined) {
          throw Error('Internal Error');
        }

        let side: SIDE;
        if (throwIfNull(userService.user).id === u.id) {
          side = this.mySide;
        } else {
          side = getOtherSide(this.mySide);
        }

        const player = new Player(u, new Unit(unitID, side));
        this.state.players.push(player);
        this.state.bases.push(new Base(u.id, side));
        this.state.units.push(player.unit);
      });
      this.startGameLoop();
    }
  }

  private onShout(data: any): void {
    const x = data[0];
    const y = data[1];
    const dirCode = data[2];
    const ID = data[3];

    this.state.bullets.push(
      new Bullet(
        ID,
        getDirByCode(dirCode),
        new Coords(x, y)
      )
    );
  }

  private onTower(data: any): void {
    const x = data[0];
    const y = data[1];
    const dirCode = data[2];
    const ID = data[3];

    this.state.towers.push(
      new Tower(
        ID,
        new Coords(x, y),
        getDirByCode(dirCode),
        getOtherSide(this.mySide)
      )
    );
  }

  private onMove(data: any): void {
    const opponent = this.state.players.filter(p => p.unit.side !== this.mySide)[0];
    if (opponent !== undefined) {
      opponent.unit.correctCoords(new Coords(data[0], data[1]));
    }
  }

  private onBombInstall(data: any): void {
    const userID = data[0];

    this.state.bombs.push(
      new Bomb(
        this.lastID += 2,
        this.state.bases.filter(b => b.id === userID)[0]
      )
    )
  }

  private onCollision(data: any): void {
    const sprite1 = this.state.findEntitiesByID(data[0]);
    const sprite2 = this.state.findEntitiesByID(data[1]);
    if (sprite1 && sprite2) {
      if (sprite1 instanceof Tower) {
        const bullets = this.state.bullets.filter(b => b.id === sprite2.id);
        bullets.sort((b1, b2) => b1.getTime() - b2.getTime());
        const bullet = bullets[data[2] - 1];
        if (!bullet) {
          return;
        }
      }
      sprite2.bumpInto(sprite1);
      sprite1.bumpInto(sprite2);
    }
  }

  private onJoinApproved(data: any): void {
    const side: SIDE = data[0] === 0 ? SIDE.MAN : SIDE.ALIEN;
    const opponentID = data[1];

    UserService.getUser(opponentID).then(opponent => {
      const me = throwIfNull(userService.user);
      this.state.users.push(me);
      this.state.users.push(opponent);
      this.mySide = side;
      this.lastID = opponent.id > me.id ? 1 : 2;
      this.tryToStartGameLoop();
    }).catch(() => {
      // TODO
    });
  }

  private rollbackEvent(event: any): void {
    const me = this.state.players.filter(p => p.unit.side === this.mySide)[0];
    // TODO: Handle all types of events
    switch (event[0]) {
      case 0: // Move
        const coords = new Coords(-event[1], -event[2]);
        me.unit.correctCoords(coords);
        break;
      default:
        // throw Error('Internal Error')
    }
  }
}

export default MultiPlayerStrategy;
