import Block from './index';

export default class Section extends Block {
  ready: boolean;

  constructor(b: Block) {
    super(b.el);
    this.ready = false;
  }
}