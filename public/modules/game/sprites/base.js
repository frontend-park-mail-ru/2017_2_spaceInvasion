import Sprite from './sprite';
import { BASE_HEIGHT, BASE_IMAGE_PATH, BASE_WIDTH } from '../../../utils/constants.ts';

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
