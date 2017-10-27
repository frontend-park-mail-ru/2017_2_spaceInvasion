import Sprite from './sprite';

const BULLET_IMAGE_PATH = '../../../images/game/bullet.png';
const BULLET_WIDTH = 25;
const BULLET_HEIGHT = 25;
const BULLET_DAMAGE = 10;

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
