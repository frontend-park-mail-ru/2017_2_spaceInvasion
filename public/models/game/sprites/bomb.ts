import Sprite from './sprite';
import {BOMB} from '../../../utils/constants';
import Base from './base';
import Temporary from '../interfaces/temporary';
import Rect from '../interfaces/rect';

export default class Bomb extends Sprite implements Temporary, Rect {
  protected readonly target: Base;
  protected readonly damage = BOMB.DAMAGE;
  protected timer: number;
  protected countDownTimer: number;
  protected time = BOMB.TICKS;

  constructor(id: number, target: Base) {
    super(
      id,
      target.getCoords(),
      BOMB.IMAGE_PATH,
      BOMB.WIDTH,
      BOMB.HEIGHT,
    );

    this.target = target;
    this.timer = window.setTimeout(this.destroy.bind(this), BOMB.LIFE_TIME);
    this.countDownTimer = window.setInterval(this.countDown.bind(this), Math.ceil(BOMB.LIFE_TIME / BOMB.TICKS));
  }

  destroy(): void {
    this.target.damage(this.damage);
    this.visible = false;
    this.cancel();
    super.destroy();
  }

  cancel(): void {
    clearTimeout(this.timer);
    clearInterval(this.countDownTimer);
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
