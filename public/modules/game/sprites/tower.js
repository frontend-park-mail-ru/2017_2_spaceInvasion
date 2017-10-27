import Sprite from './sprite';

const TOWER_IMAGE_PATH = '../../../images/game/tower.png';
const TOWER_WIDTH = 50;
const TOWER_HEIGHT = 100;
const TOWER_DAMAGE = 10;
const TOWER_HEALTH = 100;

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
