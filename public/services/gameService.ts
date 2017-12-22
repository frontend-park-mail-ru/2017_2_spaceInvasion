import {dismissAllMessages} from '../utils/notifications';
import User from '../models/user';
import GameScene from '../models/game/gameScene';
import GameJoystick from '../modules/game/controllers/joystick'
import {ConstructableController, default as ControllerInterface} from '../modules/game/controllers/controllerInterface';
import {ConstructableStrategy, default as StrategyInterface} from '../modules/game/strateges/strategyInterface';
import {EVENT, SIDE} from '../utils/constants';
import emitter from '../modules/emitter';
import SubscriptableMixin from '../models/game/mixins/subscriptableMixin';
import userService from '../services/userService';
import {throwIfNull} from '../utils/utils';
import Bot from '../models/game/sprites/bot';
import Player from "../models/game/player";

const swal = require('sweetalert2');

class GameService extends SubscriptableMixin {
  private static instance = new GameService();
  protected binded = false;
  protected strategy: StrategyInterface;
  protected scene: GameScene;
  protected controllers: ControllerInterface;
  protected running = false;
  protected requestID: number;
  protected joystick: GameJoystick;

  constructor() {
    super();

    if (GameService.instance) {
      return GameService.instance;
    }
    GameService.instance = this;
  }

  init(canvas: HTMLCanvasElement, strategy: ConstructableStrategy, controller: ConstructableController) {
    if (this.isRunning()) {
      this.destroy();
    }

    this.subscribe('GameService.start', this.start.bind(this));
    this.strategy = new strategy();
    this.scene = new GameScene(canvas);
    this.controllers = new controller;
    this.running = true;
    this.joystick = new GameJoystick();
    this.joystick.init();
    this.buildTowerBtnInit();
    this.shoot();
  }

  start(): void {
    dismissAllMessages();
    this.bind();
  }

  join(user: User, side: SIDE): void {
    this.strategy.join(user, side);
  }

  private shoot(): void {
    const shootBtn: any = document.querySelector(".shoot_btn");
    shootBtn.addEventListener("click", () => {
      emitter.emit("Player.shout." + this.getMe().unit.id);
    });
  }

  private buildTowerBtnInit(): void {
    const buildTowerBtn: any = document.querySelector(".create_tower_btn");
    buildTowerBtn.addEventListener('click', () => {
      emitter.emit("Player.setTower." + this.getMe().unit.id);
    });
  }

  private getMe(): Player {
    return this.strategy.getState().players.filter(p => {
      if (userService.user) {
        // Multiplayer
        return p.user.id === userService.user.id;
      } else {
        // Singleplayer
        return !(p.unit instanceof Bot);
      }
    })[0];
  }

  gameLoop(): void {
    const diff = this.controllers.diff();
    const newCommands = diff.filter(event => this.controllers.is(event));
    newCommands.forEach(cmd => {
      try {
        emitter.emit('Strategy.onNewCommand', cmd);
      } catch (e) {
        swal({
          titleText: 'Не получилось выполнить действие',
          type: 'error',
          text: e.message
        });
      }
    });

    const stopedCommands = diff.filter(event => !this.controllers.is(event));
    stopedCommands.forEach(cmd => emitter.emit('Strategy.onStopCommand', cmd));

    this.scene.render(this.strategy.getState());
    this.requestID = requestAnimationFrame(this.gameLoop.bind(this));
  }

  isRunning(): boolean {
    return this.running;
  }

  unbind(): void {
    if (this.binded) {
      cancelAnimationFrame(this.requestID);
      this.scene.unbind();
      this.controllers.destroy();
      this.binded = false;
    }
  }

  bind(): void {
    if (!this.binded) {
      this.requestID = requestAnimationFrame(this.gameLoop.bind(this));

      this.scene.bind();
      this.controllers.init();
      this.binded = true;
    }
  }

  destroy(): void {
    this.running = false;
    this.unbind();
    this.strategy.destroy();
    this.controllers.destroy();
    this.scene.destroy();
  }

  undoAction(action: EVENT): void {
    this.controllers.resetEvent(action);
  }
}

const gameService = new GameService();
export {GameService};
export default gameService;
