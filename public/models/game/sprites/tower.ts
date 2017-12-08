import Sprite from './sprite';
import {SIDE, TOWER} from '../../../utils/constants';
import Shootable from '../interfaces/shootable';
import Collidable from '../interfaces/collidable';
import Destructible from '../interfaces/destructible';
import Coords from '../coords';
import Bullet from './bullet';
import Rect from '../interfaces/rect';
import Temporary from '../interfaces/temporary';
import emitter from '../../../modules/emitter';
import {getBulletCoords} from '../../../utils/utils';
import Oriented from '../interfaces/oriented';

class Tower extends Sprite implements Shootable, Oriented, Collidable, Destructible, Rect, Temporary {
  public readonly cost = TOWER.COST;
  public readonly side: SIDE;
  protected interval: number;
  protected direction: Coords;
  protected health = TOWER.HEALTH;
  protected _damage = TOWER.DAMAGE;

  constructor(id: number, coords: Coords, direction: Coords, side: SIDE) {
    super(
      id,
      coords,
      TOWER.IMAGE_PATH,
      TOWER.WIDTH,
      TOWER.HEIGHT,
    );

    this.handlers = new Map();
    this.side = side;
    this.direction = direction;
    this.interval = window.setInterval(this.shout.bind(this), TOWER.SPEED);

    // Subscribes
    this.subscribe('Tower.damage.' + this.id, this.damage); // points: number
  }

  static copy(tower: Tower): Tower {
    const newTower = new Tower(tower.id, Coords.copy(tower.coords), Coords.copy(tower.direction), tower.side);
    newTower.handlers = new Map(tower.handlers);
    newTower.visible = tower.visible;
    newTower.health = tower.health;
    newTower._damage = tower._damage;
    newTower.cancel();
    newTower.interval = tower.interval;
    return newTower;
  }

  cancel(): void {
    clearInterval(this.interval)
  }

  destroy(): void {
    this.cancel();
    this.health = 0;
    this._damage = 0;
    this.visible = false;
    super.destroy();
  }

  bumpInto(obj: Collidable): void {
    if (obj instanceof Bullet) {
      this.damage(obj.getDamage());
      if (!this.alive() && this.visible) {
        this.destroy();
      }
    }
  }

  shout(): void {
    emitter.emit('Bullet', this.direction, getBulletCoords(this), this);
  }

  damage(points: number): void {
    this.health -= points;
  }

  alive(): boolean {
    return this.health > 0;
  }

  getHealth(): number {
    return this.health;
  }

  getDirection(): Coords {
    return this.direction;
  }

  getDamage(): number {
    return this._damage;
  }
}

export default Tower;