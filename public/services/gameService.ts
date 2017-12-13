import {dismissAllMessages, default as PNotify} from '../utils/notifications';
import User from '../models/user';
import GameScene from '../models/game/gameScene';
import {ConstructableController, default as ControllerInterface} from '../modules/game/controllers/controllerInterface';
import {ConstructableStrategy, default as StrategyInterface} from '../modules/game/strateges/strategyInterface';
import {EVENT, SIDE} from '../utils/constants';
import emitter from '../modules/emitter';
import SubscriptableMixin from '../models/game/mixins/subscriptableMixin';

class GameService extends SubscriptableMixin {
  private static instance = new GameService();
  protected binded = false;
  protected strategy: StrategyInterface;
  protected scene: GameScene;
  protected controllers: ControllerInterface;
  protected running = false;
  protected requestID: number;

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
  }

  start(): void {
    dismissAllMessages();
    this.bind();
  }

  join(user: User, side: SIDE): void {
    this.strategy.join(user, side);
    new PNotify({
      title: 'Пожалуйста, подождите...',
      type: 'notice',
      text: 'Подождите, пока другой игрок зайдёт в игру против Вас...',
    });
  }

  gameLoop(): void {
    const diff = this.controllers.diff();
    const newCommands = diff.filter(event => this.controllers.is(event));
    newCommands.forEach(cmd => {
      try {
        emitter.emit('Strategy.onNewCommand', cmd);
      } catch (e) {
        new PNotify({
          title: 'Не получилось выполнить действие',
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
