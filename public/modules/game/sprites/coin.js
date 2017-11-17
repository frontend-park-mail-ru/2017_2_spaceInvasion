import Sprite from './sprite';
import { COIN_COST, COIN_HEIGHT, COIN_IMAGE_PATH, COIN_WIDTH } from '../../../utils/constants.ts';

export default class Coin extends Sprite {
  constructor(xPosition, yPosition, coolDown = 10) {
    super(
      xPosition,
      yPosition,
      COIN_IMAGE_PATH,
      COIN_WIDTH,
      COIN_HEIGHT,
    );

    this.coolDown = coolDown;
    this.collected = 0;
    this.cost = COIN_COST;
  }
}
