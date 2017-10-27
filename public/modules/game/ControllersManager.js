class ControllersManager {
  constructor() {
    this.previous = {};
    this.keys = {};
    this.onPress = this.keyHandler.bind(this, 'press');
    this.onUp = this.keyHandler.bind(this, 'up');
    // this.mouseUp = this.mouseHandler.bind(this, 'mouseUp');
    // this.mouseDown = this.mouseHandler.bind(this, 'mouseDown');
  }

  init() {
    document.addEventListener('keydown', this.onPress);
    document.addEventListener('keyup', this.onUp);
    // document.addEventListener('mouseup', this.mouseUp);
    // document.addEventListener('mousedown', this.mouseDown);
  }

  diff() {
    let allkeys = [];
    allkeys.push(...Object.keys(this.previous));
    allkeys.push(...Object.keys(this.keys));
    allkeys = allkeys.map(k => k.toLowerCase());
    allkeys = allkeys.filter((key, pos, all) => all.indexOf(key, pos + 1) === -1);
    const clicked = allkeys.reduce((res, key) => {
      if (key === 'enter' || key === ' ' || key === 'shift') {
        res[key] = !this.previous[key] && this.keys[key];
      } else {
        res[key] = this.previous[key] || this.keys[key];
      }
      return res;
    }, {});
    this.previous = Object.assign({}, this.keys);
    return clicked;
  }

  is(key) {
    return this.keys[key];
  }

  keyHandler(type, event) {
    this.keys[event.key.toLowerCase()] = type === 'press';
  }

  // TODO
  // mouseHandler(type, event) {
  //   console.log(event);
  // }

  destroy() {
    document.removeEventListener('keydown', this.onPress);
    document.removeEventListener('keyup', this.onUp);
    document.removeEventListener('mouseup', this.mouseUp);
  }
}

export default ControllersManager;
