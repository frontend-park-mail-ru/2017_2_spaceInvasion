import Sprite from './sprite';
import {COIN} from '../../../utils/constants';
import Coords from '../coords';
import Collidable from '../interfaces/collidable';
import Temporary from '../interfaces/temporary';
import Unit from './unit';
import Rect from '../interfaces/rect';

class Coin extends Sprite implements Collidable, Rect {
  protected cost = COIN.COST;

  constructor(id: number, coords: Coords) {
    super(
      id,
      coords,
      COIN.IMAGE_PATH,
      COIN.WIDTH,
      COIN.HEIGHT,
    );
  }

  static copy(coin: Coin): Coin {
    const newCoin = new Coin(coin.id, Coords.copy(coin.coords));
    newCoin.visible = coin.visible;
    newCoin.handlers = new Map(coin.handlers);
    newCoin.cost = coin.cost;
    return newCoin;
  }

  bumpInto(obj: Collidable): void {
    if (obj instanceof Unit) {
      this.destroy();
    }
  }

  getCost(): number {
    return this.cost;
  }

  destroy(): void {
    this.visible = false;
    super.destroy();
  }
}

export default Coin;