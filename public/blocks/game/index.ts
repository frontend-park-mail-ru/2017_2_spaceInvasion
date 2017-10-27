import Block from '../block/index';
import gameTemplate from './game.pug';

class Game extends Block {
  constructor() {
    const el = document.createElement('div');
    el.innerHTML = gameTemplate();
    super(el);
  }
}

export default Game;
