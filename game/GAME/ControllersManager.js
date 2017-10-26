window.ControllersManager = (function (window) {

	class ControllersManager {
		constructor() {
			this.previous = {};
			this.keys = {};
			this._onPress = this._keyHandler.bind(this, 'press');
			this._onUp = this._keyHandler.bind(this, 'up');
			this._mouseUp = this._mouseHandler.bind(this, 'mouseUp');
			// this._mouseDown = this._mouseDown.bind(this, 'mouseDon')
		}

		init() {
			document.addEventListener('keydown', this._onPress);
			document.addEventListener('keyup', this._onUp);
			// document.addEventListener('mouseup', this._mouseUp);
		}

		diff() {
			let allkeys = [];
			allkeys.push.apply(allkeys, Object.keys(this.previous));
			allkeys.push.apply(allkeys, Object.keys(this.keys));
			allkeys = allkeys.map(k => k.toLowerCase());
			allkeys = allkeys.filter((key, pos, all) => {
				return all.indexOf(key, pos + 1) === -1;
			});
			const clicked = allkeys.reduce((res, key) => {
				if (key === "enter" || key ===" " || key === "shift"){
          res[key] = !this.previous[key] && this.keys[key]
				}
				else {
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

		_keyHandler(type, event) {
			this.keys[event.key.toLowerCase()] = type === 'press';
		}

		// TODO
		_mouseHandler(type, event) {
			console.log(event);
		}

		destroy() {
			document.removeEventListener('keydown', this._onPress);
			document.removeEventListener('keyup', this._onUp);
			document.removeEventListener('mouseup', this._mouseUp);
		}
	}

	return ControllersManager;
})(window);
