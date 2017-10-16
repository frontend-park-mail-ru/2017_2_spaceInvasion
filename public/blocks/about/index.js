import Block from '../block/index';
import aboutTemplate from './about.pug';

class About extends Block {
  constructor() {
    const el = document.createElement('div');
    el.innerHTML = aboutTemplate();
    super(el);
  }
}

export default About;
