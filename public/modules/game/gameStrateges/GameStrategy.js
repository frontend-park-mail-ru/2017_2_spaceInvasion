class GameStrategy {
  constructor() {
    if (this.constructor.name === GameStrategy.name) {
      throw new TypeError('Can not create instance of GameStrategy');
    }

    this.state = null;
  }
}

export default GameStrategy;
