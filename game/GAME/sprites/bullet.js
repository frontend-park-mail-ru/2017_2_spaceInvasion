window.Bullet = (function (window) {

  const BULLET_IMAGE_PATH = "images/bullet.png"
  const BULLET_WIDTH = 25;
  const BULLET_HEIGHT = 25;
  const BULLET_DAMAGE = 10;

  const  {Sprite} = window


  // TODO damage в конструкторе
  class Bullet extends Sprite {
    constructor (direction, x_position, y_position, damage) {
      super(x_position,
        y_position,
        BULLET_IMAGE_PATH,
        BULLET_WIDTH,
        BULLET_HEIGHT);
      this.direction = direction;
      this.damage = BULLET_DAMAGE;
      this.deleted = 0;
    }

    damaged (sprite){
      this.deleted = 1;


    }
  }
  return Bullet;
})(window);