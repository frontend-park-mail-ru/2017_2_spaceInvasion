import {AREA, FPS} from '../../../utils/constants';
import StrategyInterface from './strategyInterface';
import GameState from '../../../models/game/state';
import collisionService from '../../../services/collisionService';
import SubscriptableMixin from '../../../models/game/mixins/subscriptableMixin';

abstract class Strategy extends SubscriptableMixin implements StrategyInterface {
  readonly height: number;
  readonly width: number;
  public running: boolean;
  protected funcFinishGame: (victory: boolean) => any;
  protected state: GameState;
  protected interval: number;

  constructor() {
    super();
    this.height = AREA.HEIGHT;
    this.width = AREA.WIDTH;
    this.state = new GameState();

    // Subscribes
    this.subscribe('Strategy.height', () => this.height); // --No arguments--
    this.subscribe('Strategy.width', () => this.width); // --No arguments--
  }

  private emitterInit(): void {
    // Subscribes
    this.subscribe('Strategy.onNewCommand', this.onNewCommand.bind(this)); // command: EVENT
    this.subscribe('Strategy.onStopCommand', this.onStopCommand.bind(this)); // command: EVENT
  }

  abstract onNewCommand(...data: any[]): void;
  abstract onStopCommand(...data: any[]): void;

  abstract join(...data: any[]): boolean;

  startGameLoop(): void {
    if (!this.running) {
      this.emitterInit();
      this.interval = window.setInterval(this.gameLoop.bind(this), FPS);
      this.running = true;
    }
  }

  stopGameLoop(): void {
    if (this.running) {
      clearInterval(this.interval);
      this.running = false;
    }
  }

  getState(): GameState {
    return this.state;
  }

  destroy(): void {
    this.stopGameLoop();
    collisionService.clear();
    this.state.destroy();
  }

  protected abstract gameLoop(): void;
}

export default Strategy;