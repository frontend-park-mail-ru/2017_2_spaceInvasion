window.Bomb = (function (window) {

  const BOMB_IMAGE_PATH = "images/bomb.png"
  const BOMB_WIDTH = 30;
  const BOMB_HEIGHT = 30;


  const  {Sprite} = window

  class Bomb extends  Sprite {

    constructor (x_position, y_position, coolDown = 200) {
      super(x_position,
        y_position,
        BOMB_IMAGE_PATH,
        BOMB_WIDTH,
        BOMB_HEIGHT);

      this.coolDown = coolDown;
    }
  }
  return Bomb;
})(window);