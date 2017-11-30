import PNotify, {dismissAllMessages} from '../utils/notifications';
import User from '../models/user';
import GameScene from '../models/game/gameScene';
import {ConstructableController, default as ControllerInterface} from '../modules/game/controllers/controllerInterface';
import {ConstructableStrategy, default as StrategyInterface} from '../modules/game/strateges/strategyInterface';
import {SIDE} from '../utils/constants';
import emitter from '../modules/emitter';
import SubscriptableMixin from '../models/game/mixins/subscriptableMixin';
import Navigator from '../modules/navigator';
import LoginBlock from '../blocks/login/index';

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

    this.strategy = new strategy(this.onFinishGame.bind(this));
    this.scene = new GameScene(canvas);
    this.controllers = new controller;
    this.running = true;

    // Subscribes
    this.subscribe('GameService.onFinishGame', this.onFinishGame); // victory: boolean
    this.subscribe('GameService.join', this.join.bind(this)); // user: User, side: SIDE
  }

  join(user: User, side: SIDE): void {
    if (this.strategy.join(user, side)) {
      dismissAllMessages();
      this.bind();
    } else {
      new PNotify({
        title: 'Пожалуйста, подождите...',
        type: 'notice',
        text: 'Подождите, пока другой игрок зайдёт в игру против Вас...',
      });
    }
  }

  gameLoop(): void {
    const newCommands = this.controllers.newCommands();
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

    const stopedCommands = this.controllers.stoppedCommands();
    stopedCommands.forEach(cmd => emitter.emit('Strategy.onStopCommand', cmd));

    this.scene.render(this.strategy.getState());
    this.requestID = requestAnimationFrame(this.gameLoop.bind(this));
  }

  onFinishGame(...data: any[]): void {
    const victory = data[0] as boolean;
    this.destroy();
    Navigator.sections.hide();
    (Navigator.sections.home as LoginBlock).show(); // TODO: Сверстать homepage
    new PNotify({
      title: 'Игра окончена',
      type: (victory ? 'success' : 'notice'),
      text: (victory ? 'Вы победили!' : 'Вы проиграли!'),
      buttons: {
        sticker: false,
      },
    });
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
}

const gameService = new GameService();
export {GameService};
export default gameService;
