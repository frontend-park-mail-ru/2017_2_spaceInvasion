import Sprite from './sprite';
import { TOWER_IMAGE_PATH, TOWER_DAMAGE, TOWER_HEALTH, TOWER_HEIGHT, TOWER_WIDTH } from '../../../utils/constants.ts';

export default class Tower extends Sprite {
  constructor(coolDown, xPosition, yPosition, direction = 'RIGHT') {
    super(
      xPosition,
      yPosition,
      TOWER_IMAGE_PATH,
      TOWER_WIDTH,
      TOWER_HEIGHT,
    );
    this.coolDown = coolDown;
    this.damage = TOWER_DAMAGE;
    this.health = TOWER_HEALTH;
    this.direction = direction;
  }

  damaged(sprite) {
    this.health -= sprite.damage;
    if (this.health < 0) {
      this.health = 0;
    }
  }
}
