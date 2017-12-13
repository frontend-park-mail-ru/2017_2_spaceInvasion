import {AREA, FPS} from '../../../utils/constants';
import StrategyInterface from './strategyInterface';
import GameState from '../../../models/game/state';
import collisionService from '../../../services/collisionService';
import SubscriptableMixin from '../../../models/game/mixins/subscriptableMixin';
import Coords from '../../../models/game/coords';
import {BOT, SIDE, TOWER} from '../../../utils/constants';
import MovableMixin from '../../../models/game/mixins/movableMixin';
import Shootable from '../../../models/game/interfaces/shootable';
import emitter from '../../emitter';
import Tower from '../../../models/game/sprites/tower';
import Bullet from '../../../models/game/sprites/bullet';

abstract class Strategy extends SubscriptableMixin implements StrategyInterface {
  readonly height: number;
  readonly width: number;
  public running: boolean;
  protected state: GameState;
  protected interval: number;
  protected lastID = 0;

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
    this.subscribe('Bullet', this.newBullet.bind(this)); // direction: Coords, coords: Coords, source: Shootable
    this.subscribe('Tower', this.setTower.bind(this)); // coords: Coords, direction: Coords, side: SIDE
    this.subscribe('Tower.random', this.setRandomTower.bind(this)); // --No arguments--
  }

  abstract onNewCommand(...data: any[]): void;
  abstract onStopCommand(...data: any[]): void;

  abstract join(...data: any[]): boolean;

  startGameLoop(): void {
    if (!this.running) {
      this.emitterInit();
      this.interval = window.setInterval(this.gameLoop.bind(this), 1000 / FPS);
      this.running = true;
      emitter.emit('GameService.start');
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
    super.destroy();
  }

  protected newBullet(...data: any[]): void {
    let direction = data[0] as Coords;
    const coords = data[1] as Coords;
    this.state.bullets.push(new Bullet(this.lastID += 2, direction, coords));
  }

  protected setTower(...data: any[]): void {
    const coords = data[0] as Coords;
    const direction = data[1] as Coords;
    const side = data[2] as SIDE;
    this.state.towers.push(
      new Tower(
        this.lastID += 2, Coords.copy(coords), direction, side
      )
    );
  }

  protected setRandomTower(...data: any[]): void {
    const side = data[0] as SIDE;
    this.state.towers.push(
      new Tower(
        this.lastID += 2,
        new Coords(
          side === SIDE.MAN ? BOT.TOWER_OFFSET : emitter.emit('Strategy.width') - BOT.TOWER_OFFSET,
          Math.random() * (emitter.emit('Strategy.height') - TOWER.HEIGHT) + TOWER.HEIGHT / 2
        ),
        side === SIDE.MAN ? new Coords(1, 0) : new Coords(-1, 0),
        side
      )
    );
  }

  protected abstract gameLoop(): void;
}

export default Strategy;