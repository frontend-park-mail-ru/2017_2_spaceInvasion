window.Player = (function (window) {

  const  {Unit} = window
  const  {Base} = window
  const {Bullet} = window

  const LEFT = "LEFT";
  const RIGHT = "RIGHT";
  const UP = "UP";
  const DOWN = "DOWN";

  class Player {
    constructor (name, baseOptions, manOptions) {
      this.name = name;
      this.unit = new Unit(manOptions.manHealth,
        manOptions.manXpos,
        manOptions.manYpos);
      this.towers = [];
      this.bomb = null;
      this.base = new Base (baseOptions.baseHealth,
        baseOptions.baseXpos,
        baseOptions.baseYpos);
      this.coins = 10;
    }

    moveMan(direction){
      if (direction === UP){
        this.unit.goUp();
      }
      if (direction === DOWN){
        this.unit.goDown();
      }
      if (direction === RIGHT){
        this.unit.goRight();
      }
      if (direction === LEFT){
        this.unit.goLeft();
      }
    }

    shootMan() {
      if (this.unit.direction === LEFT){
        return new Bullet (this.unit.direction,
          this.unit.x_position - 26, // TODO 26 - ширина пули + 1
          this.unit.y_position + this.unit.height/2 + 1)
      } else { // в право
        return new Bullet (this.unit.direction,
          this.unit.x_position + this.unit.width + 1,
          this.unit.y_position + this.unit.height/2 + 1)
      }
    }
  }
  return Player;
})(window);