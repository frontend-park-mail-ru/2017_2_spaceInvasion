import Sprite from './sprite';

const COIN_IMAGE_PATH = '../../../images/game/coin.png';
const COIN_WIDTH = 30;
const COIN_HEIGHT = 30;
const COIN_COST = 10;

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
