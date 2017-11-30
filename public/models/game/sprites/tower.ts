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
import {throwIfNull} from '../../../utils/utils';

class Tower extends Sprite implements Shootable, Collidable, Destructible, Rect, Temporary {
  public readonly cost = TOWER.COST;
  public readonly side: SIDE;
  protected interval: number;
  protected direction: number|null;
  protected health = TOWER.HEALTH;
  protected _damage = TOWER.DAMAGE;

  constructor(id: number, coords: Coords, direction: number|null, side: SIDE) {
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
    this.coords = coords;
    this.interval = window.setInterval(this.shout.bind(this), TOWER.SPEED);

    // Subscribes
    this.subscribe('Tower.damage.' + this.id, this.damage); // points: number
  }

  cancel(): void {
    clearInterval(this.interval)
  }

  destroy(): void {
    this.cancel();
    this.health = 0;
    this._damage = 0;
    this.direction = null;
    this.visible = false;
    super.destroy();
  }

  bumpInto(obj: Collidable): void {
    if (obj instanceof Bullet) {
      this.damage(obj.getDamage());
      if (!this.alive()) {
        this.destroy();
      }
    }
  }

  shout(): void {
    const hypotenuse = Math.sqrt(Math.pow(this.height, 2) + Math.pow(this.width, 2));
    emitter.emit('Bullet', this.direction, new Coords(
      hypotenuse * Math.cos(throwIfNull(this.direction)),
      hypotenuse * Math.sin(throwIfNull(this.direction))
    ), this);
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

  getDirection(): number|null {
    return this.direction;
  }

  getDamage(): number {
    return this._damage;
  }
}

export default Tower;