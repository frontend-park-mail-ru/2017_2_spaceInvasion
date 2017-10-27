import Sprite from './sprite';

const UNIT_IMAGE_PATH = '../../../images/game/alienUnit.png';
const UNIT_WIDTH = 50;
const UNIT_HEIGHT = 50;
const UNIT_DAMAGE = 10;

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

const modelWidth = 960;
const modelHeight = 640;

const SPEED = 5;

export default class Unit extends Sprite {
  constructor(health = 100, xPosition, yPosition = 260) {
    super(
      xPosition,
      yPosition,
      UNIT_IMAGE_PATH,
      UNIT_WIDTH,
      UNIT_HEIGHT,
    );
    this.health = health;
    this.direction = LEFT;
    this.coolDown = 0;
    this.damage = UNIT_DAMAGE;
  }

  goDown() {
    this.yPosition += SPEED;
    if (this.yPosition + this.height > modelHeight) {
      this.yPosition = modelHeight - this.height;
    }
  }

  goUp() {
    this.yPosition -= SPEED;
    if (this.yPosition < 0) {
      this.yPosition = 0;
    }
  }

  goRight() {
    this.xPosition += SPEED;
    this.direction = RIGHT;
    if (this.xPosition + this.width > modelWidth) {
      this.xPosition = modelWidth - this.width;
    }
  }

  goLeft() {
    this.xPosition -= SPEED;
    this.direction = LEFT;
    if (this.xPosition < 0) {
      this.xPosition = 0;
    }
  }

  // TODO обработка смерти
  damaged(sprite) {
    this.health -= sprite.damage;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  setCoolDown(coolDown) {
    this.coolDown = coolDown;
  }
}
