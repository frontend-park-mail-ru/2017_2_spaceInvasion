import Sprite from './sprite';
import {MUSHROOM} from '../../../utils/constants';
import Coords from '../coords';
import Rect from '../interfaces/rect';

class Mushroom extends Sprite implements Rect {

  public opacity = 0;
  public ticks: number;
  protected timer: number;

  constructor(id: number, coords: Coords) {
    super(
      id,
      coords,
      MUSHROOM.IMAGE_PATH,
      MUSHROOM.WIDTH,
      MUSHROOM.HEIGHT,
    );

    this.opacity = 0;
    this.timer = window.setTimeout(this.destroy.bind(this), MUSHROOM.LIFE_TIME);
    this.ticks = MUSHROOM.TICKS;
    this.visible = false;
  }


  // cancel(): void {
  //   clearTimeout(this.timer);
  //   clearInterval(this.countDownTimer);
  // }
  //
  // getTime(): number {
  //   return this.time;
  // }
  //
  // protected countDown(): void {
  //   if (this.time > 0) {
  //     this.time--;
  //   }
  //
  //
  // destroy(): void {
  //     this.visible = false;
  //     // this.cancel();
  //     super.destroy();
  // }
}

export default Mushroom;