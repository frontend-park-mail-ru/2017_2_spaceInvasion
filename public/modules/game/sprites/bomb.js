import Sprite from './sprite';
import { BOMB_HEIGHT, BOMB_IMAGE_PATH, BOMB_WIDTH } from '../../../utils/constants.ts';

export default class Bomb extends Sprite {
  constructor(xPosition, yPosition, coolDown = 200) {
    super(
      xPosition,
      yPosition,
      BOMB_IMAGE_PATH,
      BOMB_WIDTH,
      BOMB_HEIGHT,
    );

    this.coolDown = coolDown;
  }
}
