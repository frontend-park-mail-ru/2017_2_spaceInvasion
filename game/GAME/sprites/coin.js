window.Coin = (function (window) {

  const COIN_IMAGE_PATH = "images/coin.png"
  const COIN_WIDTH = 30;
  const COIN_HEIGHT = 30;
  const COIN_COST = 10


  const  {Sprite} = window

  class Coin extends  Sprite {

    constructor (x_position, y_position, coolDown = 10) {
      super(x_position,
        y_position,
        COIN_IMAGE_PATH,
        COIN_WIDTH,
        COIN_HEIGHT);

      this.coolDown = coolDown;
      this.collected = 0;
      this.cost = COIN_COST;
    }
  }
  return Coin;
})(window);