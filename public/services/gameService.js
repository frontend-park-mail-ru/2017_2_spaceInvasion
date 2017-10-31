import GameScene from '../modules/game/gameStrateges/GameScene';
import ControllersManager from '../modules/game/ControllersManager';
import { showHome } from '../main.ts';
import { PNotify } from '../index.ts';

class GameService {
  init(username, canvas, Strategy) {
    this.running = false;
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
    this.running = true;
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

  onFinishGame(victory) {
    this.destroy();
    showHome();
    return new PNotify({
      title: 'Игра окончена',
      type: (victory ? 'success' : 'notice'),
      text: (victory ? 'Вы победили!' : 'Вы проиграли!'),
      buttons: {
        sticker: false,
      },
    });
  }

  isRunning() {
    return this.running;
  }

  destroy() {
    if (this.requestID) {
      cancelAnimationFrame(this.requestID);
    }

    this.running = false;
    this.strategy.destroy();
    this.scene.destroy();
    this.controllers.destroy();
  }
}

const gameService = new GameService();
export default gameService;
