import GameStrategy from './game/gameStrateges/GameStrategy';
import gameManager from '../services/gameService';

class Game {
  constructor(Strategy, username, canvas) {
    if (!(Strategy.prototype instanceof GameStrategy)) {
      throw new TypeError('Strategy is not a GameStrategy');
    }
    this.username = username;
    this.canvas = canvas;
    this.manager = gameManager;
    this.manager.init(this.username, this.canvas, Strategy);
  }

  destroy() {
    this.manager.destroy();
    this.manager = null;
  }
}

export default Game;
