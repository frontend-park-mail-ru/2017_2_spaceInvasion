window.Base = (function (window) {

  const BASE_IMAGE_PATH = "images/base.png"
  const BASE_WIDTH = 110;
  const BASE_HEIGHT = 110;

  const  {Sprite} = window

  class Base extends  Sprite {
    constructor (health = 3, x_position, y_position = 230) {
      super(x_position,
        y_position,
        BASE_IMAGE_PATH,
        BASE_WIDTH,
        BASE_HEIGHT);
      this.health  = health;
    }
  }
  return Base;
})(window);