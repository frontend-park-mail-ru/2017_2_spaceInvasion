import {ConstructableStrategy} from '../modules/game/strateges/strategyInterface';
import gameService from '../services/gameService';
import User from './user';
import {ConstructableController} from '../modules/game/controllers/controllerInterface';
import {SIDE} from '../utils/constants';
import SubscriptableMixin from './game/mixins/subscriptableMixin';
import LoginBlock from '../blocks/login/index';
import PNotify from '../utils/notifications';
import Navigator from '../modules/navigator';

class Game extends SubscriptableMixin {
  public users: User[];
  public canvas: HTMLCanvasElement;

  constructor(Strategy: ConstructableStrategy, controller: ConstructableController, canvas: HTMLCanvasElement) {
    super();
    this.users = [];
    this.canvas = canvas;
    gameService.init(this.canvas, Strategy, controller);

    // Subscribes
    this.subscribe('Game.join', this.join.bind(this)); // user: User, side: SIDE
    this.subscribe('Game.onFinishGame', this.onFinishGame); // victory: boolean
    this.subscribe('Game.undoAction', gameService.undoAction.bind(gameService)); // action: EVENT
  }

  join(user: User, side: SIDE): void {
    this.users.push(user);
    gameService.join(user, side);
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

  destroy(): void {
    super.destroy();
    gameService.destroy();
    this.canvas.hidden = true;
  }
}

export default Game;
