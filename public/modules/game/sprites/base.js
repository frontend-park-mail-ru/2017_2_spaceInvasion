import Sprite from './sprite';

const BASE_IMAGE_PATH = '../../../images/game/base.png';
const BASE_WIDTH = 110;
const BASE_HEIGHT = 110;

export default class Base extends Sprite {
  constructor(health = 3, xPosition, yPosition = 230) {
    super(
      xPosition,
      yPosition,
      BASE_IMAGE_PATH,
      BASE_WIDTH,
      BASE_HEIGHT,
    );
    this.health = health;
  }
}
