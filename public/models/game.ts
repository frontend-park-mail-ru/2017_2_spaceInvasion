import {ConstructableStrategy} from '../modules/game/strateges/strategyInterface';
import gameService from '../services/gameService';
import User from './user';
import {ConstructableController} from '../modules/game/controllers/controllerInterface';
import {SIDE} from '../utils/constants';
import SubscriptableMixin from './game/mixins/subscriptableMixin';
import Navigator from '../modules/navigator';
import {dismissAllMessages} from '../utils/notifications';

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
    dismissAllMessages();
    const victory = data[0] as boolean;
    this.destroy();
    Navigator.sections.hide();
    Navigator.sections.winlose.show(victory);
  }

  destroy(): void {
    super.destroy();
    gameService.destroy();
    this.canvas.hidden = true;
  }
}

export default Game;
