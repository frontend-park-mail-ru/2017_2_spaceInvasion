import GameScene from './GameScene';
import ControllersManager from '../ControllersManager';

class GameManager {
  constructor(username, canvas, Strategy) {
    this.username = username;
    this.strategy = new Strategy(this.onNewState.bind(this), this.onFinishGame.bind(this));
    this.scene = new GameScene(canvas);
    this.controllers = new ControllersManager();
    this.onStart();
    this.strategy.onLoggedIn(this.username);
  }

  onStart() {
    this.controllers.init();
    this.startGameLoop();
  }

  startGameLoop() {
    this.requestID = requestAnimationFrame(this.gameLoop.bind(this));
  }

  onNewState(state) {
    this.state = state;
  }

  gameLoop() {
    const controlsUpdates = this.controllers.diff();

    if (Object.keys(controlsUpdates).some(k => controlsUpdates[k])) {
      this.strategy.onNewCommand(controlsUpdates);
    }

    this.scene.setState(this.state);

    this.scene.render();
    this.requestID = requestAnimationFrame(this.gameLoop.bind(this));
  }

  onFinishGame() {
    this.destroy();
  }

  destroy() {
    if (this.requestID) {
      cancelAnimationFrame(this.requestID);
    }

    this.strategy.destroy();
    this.scene.destroy();
    this.controllers.destroy();
  }
}

export default GameManager;
