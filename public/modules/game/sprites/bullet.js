import Sprite from './sprite';
import { BULLET_DAMAGE, BULLET_HEIGHT, BULLET_IMAGE_PATH, BULLET_WIDTH } from '../../../utils/constants.ts';

// TODO damage в конструкторе
export default class Bullet extends Sprite {
  constructor(direction, xPosition, yPosition, damage) {
    super(
      xPosition,
      yPosition,
      BULLET_IMAGE_PATH,
      BULLET_WIDTH,
      BULLET_HEIGHT,
    );
    this.direction = direction;
    this.damage = damage || BULLET_DAMAGE;
    this.deleted = 0;
  }

  damaged() {
    this.deleted = 1;
  }
}
