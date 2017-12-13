import Sprite from './sprite';
import {COIN} from '../../../utils/constants';
import Coords from '../coords';
import Collidable from '../interfaces/collidable';
import Temporary from '../interfaces/temporary';
import Unit from './unit';
import Rect from '../interfaces/rect';

class Coin extends Sprite implements Collidable/*, Temporary */, Rect {
  // protected timer: number;
  // protected countDownTimer: number;
  // protected time = COIN.TICKS;
  protected cost = COIN.COST;

  constructor(id: number, coords: Coords) {
    super(
      id,
      coords,
      COIN.IMAGE_PATH,
      COIN.WIDTH,
      COIN.HEIGHT,
    );

    // this.timer = window.setTimeout(this.destroy.bind(this), COIN.LIFE_TIME);
    // this.countDownTimer = window.setInterval(this.countDown.bind(this), Math.ceil(COIN.LIFE_TIME / COIN.TICKS));
  }

  static copy(coin: Coin): Coin {
    const newCoin = new Coin(coin.id, Coords.copy(coin.coords));
    newCoin.visible = coin.visible;
    newCoin.handlers = new Map(coin.handlers);
    // newCoin.time = coin.time;;
    // newCoin.countDownTimer = coin.countDownTimer;
    // newCoin.timer = coin.timer;
    newCoin.cost = coin.cost;
    // newCoin.cancel();
    return newCoin;
  }

  bumpInto(obj: Collidable): void {
    if (obj instanceof Unit) {
      this.destroy();
    }
  }

  /*
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
  }*/

  getCost(): number {
    return this.cost;
  }

  destroy(): void {
    this.visible = false;
    // this.cancel();
    super.destroy();
  }
}

export default Coin;