import Bullet from './sprites/bullet';
import Tower from './sprites/tower';
import Unit from './sprites/unit';
import Coin from './sprites/coin';
import Player from './player';
import Base from './sprites/base';
import Bomb from './sprites/bomb';
import SubscriptableMixin from './mixins/subscriptableMixin';
import Coords from './coords';
import {SIDE, TOWER} from '../../utils/constants';
import Shootable from './interfaces/shootable';

class GameState extends SubscriptableMixin {
  public players: Player[];
  public bases: Base[];
  public units: Unit[];
  public towers: Tower[];
  public coins: Coin[];
  public bullets: Bullet[];
  public bombs: Bomb[];

  constructor() {
    super();

    this.players = [];
    this.bases = [];
    this.units = [];
    this.towers = [];
    this.coins = [];
    this.bullets = [];
    this.bombs = [];

    // Subscribes
    this.subscribe('Bullet', this.newBullet); // direction: number|null, coords: Coords, source: Shootable
    this.subscribe('Tower', this.setTower); // coords: Coords, direction: number|null, side: SIDE
    this.subscribe('Tower.random', this.setRandomTower); // --No arguments--
  }

  destroy(): void {
    this.players = [];
    this.bases.forEach(b => b.destroy());
    this.units.forEach(u => u.destroy());
    this.towers.forEach(t => t.destroy());
    this.coins.forEach(c => c.destroy());
    this.bullets.forEach(b => b.destroy());
    this.bombs.forEach(b => b.destroy());
  }

  protected newBullet(...data: any[]): void {
    const direction = data[0] as number|null;
    const coords = data[1] as Coords;
    const source = data[2] as Shootable;

    this.bullets.push(new Bullet(this.bullets.length, direction, coords, source));
  }

  protected setTower(...data: any[]): void {
    const coords = data[0] as Coords;
    const direction = data[1] as number|null;
    const side = data[2] as SIDE;
    this.towers.push(
      new Tower(
        this.towers.length, coords, direction, side
      )
    );
  }

  protected setRandomTower(...data: any[]): void {
    this.towers.push(
      new Tower(
        this.towers.length,
        new Coords(
          130,
          Math.random() * -TOWER.HEALTH / 2
        ),
        90,
        SIDE.ALIEN
      )
    );
  }
}

export default GameState;