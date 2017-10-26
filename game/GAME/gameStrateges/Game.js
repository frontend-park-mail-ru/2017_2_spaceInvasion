window.Game = (function (window) {
	const Mediator = window.Mediator;
	const GameStrategy = window.GameStrategy;
	const GameManager = window.GameManager;

	const mediator = new Mediator;

	class Game {

		constructor(Strategy, username, canvas) {
			if (!(Strategy.prototype instanceof GameStrategy)) {
				throw new TypeError('Strategy is not a GameStrategy');
			}
			this.username = username;
			this.canvas = canvas;
			this.manager = new GameManager(this.username, this.canvas, Strategy);
		}
		destroy() {
			this.manager.destroy();
			this.manager = null;
		}
	}
	return Game;
})(window);
