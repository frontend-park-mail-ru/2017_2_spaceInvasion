(function aboutIndex() {
  const { Block } = window;
  const AboutTemplate = window.aboutTemplate;

  class About extends Block {
    constructor() {
      const el = document.createElement('div');
      el.innerHTML = AboutTemplate();
      super(el);
    }
  }

  window.About = About;
}());
