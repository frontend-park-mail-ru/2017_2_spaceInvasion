window.GameView = (function (window) {
	const View = window.View;

	class GameView extends View {
		constructor() {
			console.info("GameView constructor")
			super();

			this.canvas = this._el.querySelector('.game-view__canvas-element');
			console.log(this.canvas)
		}
	}


	return GameView;
})(window);
