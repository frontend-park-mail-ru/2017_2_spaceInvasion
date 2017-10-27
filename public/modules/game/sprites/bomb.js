import Sprite from './sprite';

const BOMB_IMAGE_PATH = '../../../images/game/bomb.png';
const BOMB_WIDTH = 30;
const BOMB_HEIGHT = 30;

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
