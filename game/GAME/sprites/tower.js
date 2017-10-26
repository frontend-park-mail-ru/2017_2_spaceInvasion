window.Tower = (function (window) {

  const TOWER_IMAGE_PATH = "images/tower.png"
  const TOWER_WIDTH = 50;
  const TOWER_HEIGHT = 100;
  const TOWER_DAMAGE = 10;
  const TOWER_HEALTH = 100;

  const  {Sprite} = window

  class Tower extends  Sprite {

    constructor (coolDown, x_position, y_position, direction = "RIGHT") {
      super(x_position,
        y_position,
        TOWER_IMAGE_PATH,
        TOWER_WIDTH,
        TOWER_HEIGHT);
      this.coolDown = coolDown;
      this.damage = TOWER_DAMAGE;
      this.health = TOWER_HEALTH;
      this.direction = direction;
    }


    damaged (sprite) {
      this.health -= sprite.damage;
      if (this.health < 0){
        this.health = 0;
      }
    }


  }
  return Tower;
})(window);