import {ConstructableStrategy} from '../modules/game/strateges/strategyInterface';
import gameService from '../services/gameService';
import User from './user';
import {ConstructableController} from '../modules/game/controllers/controllerInterface';
import {SIDE} from '../utils/constants';

class Game {
  public users: User[];
  public canvas: HTMLCanvasElement;

  constructor(Strategy: ConstructableStrategy, controller: ConstructableController, canvas: HTMLCanvasElement) {
    this.users = [];
    this.canvas = canvas;
    gameService.init(this.canvas, Strategy, controller);
  }

  join(user: User, side: SIDE): void {
    this.users.push(user);
    gameService.join(user, side);
  }

  destroy(): void {
    gameService.destroy();
    this.canvas.hidden = true;
  }
}

export default Game;
