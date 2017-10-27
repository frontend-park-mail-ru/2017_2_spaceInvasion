import GameStrategy from './game/gameStrateges/GameStrategy';
import GameManager from './game/gameStrateges/GameManager';

class Game {
  constructor(Strategy, username, canvas) {
    if (!(Strategy.prototype instanceof GameStrategy)) {
      throw new TypeError('Strategy is not a GameStrategy');
    }
    this.username = username;
    this.canvas = canvas;
    this.manager = new GameManager(this.username, this.canvas, Strategy);
  }

  destroy() {
    this.manager.destroy();
    this.manager = null;
  }
}

export default Game;
