import MovableMixin from '../mixins/movableMixin';
import Coords from '../coords';
import Collidable from '../interfaces/collidable';
import Unit from './unit';
import Tower from './tower';
import Temporary from '../interfaces/temporary';
import Shootable from '../interfaces/shootable';
import Rect from '../interfaces/rect';
import {BULLET} from '../../../utils/constants';
import Movable from '../interfaces/movable';
import SubscriptableMixin from '../mixins/subscriptableMixin';
import Oriented from '../interfaces/oriented';

export default class Bullet extends MovableMixin implements Movable, Oriented, SubscriptableMixin, Collidable/*, Temporary*/, Rect {
  protected damage = BULLET.DAMAGE;
  // protected timer: number;
  protected time = BULLET.TICKS;
  protected countDownTimer: number;

  constructor(id: number, direction: Coords, coords: Coords) {
    super(
      id,
      coords,
      BULLET.IMAGE_PATH,
      BULLET.WIDTH,
      BULLET.HEIGHT,
    );

    this.speed = BULLET.SPEED;
    this.direction = direction;
    // this.timer = window.setTimeout(this.destroy.bind(this), BULLET.LIFE_TIME);
    this.countDownTimer = window.setInterval(this.countDown.bind(this), Math.ceil(BULLET.LIFE_TIME / BULLET.TICKS));
  }

  static copy(bullet: Bullet): Bullet {
    const newBullet = new Bullet(bullet.id, bullet.direction, bullet.coords);
    newBullet.speed = bullet.speed;
    newBullet.visible = bullet.visible;
    newBullet.handlers = new Map(bullet.handlers);
    newBullet.damage = bullet.damage;
    newBullet.time = bullet.time;
    newBullet.cancel();
    // newBullet.timer = bullet.timer;
    newBullet.countDownTimer = bullet.countDownTimer;
    return newBullet;
  }

  move(dir?: Coords): void {
    super.move();
    if (this.speed === 0) {
      this.destroy();
    }
  }

  cancel(): void {
    // clearTimeout(this.timer);
    clearInterval(this.countDownTimer);
  }

  destroy(): void {
    this.visible = false;
    this.speed = 0;
    this.damage = 0;
    this.cancel();
    super.destroy();
  }

  bumpInto(obj: Collidable): void {
    if (obj instanceof Unit || obj instanceof Tower) {
      this.destroy();
    }
  }

  getDamage(): number {
    return this.damage;
  }

  getDirection(): Coords {
    return this.direction;
  }

  getTime(): number {
    return this.time;
  }

  protected countDown(): void {
    if (this.time > 0) {
      this.time--;
    }
  }
}
