import Block from '../block/index';

const AboutTemplate = window.aboutTemplate;

class About extends Block {
  constructor() {
    const el = document.createElement('div');
    el.innerHTML = AboutTemplate();
    super(el);
  }
}

export default About;
