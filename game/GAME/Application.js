window.Application = (function (window) {
	const EVENTS = window.EVENTS;
	const Mediator = window.Mediator;
	// const FinishView = window.FinishView;
	const GameView = window.GameView;
	const SinglePlayerStrategy = window.SinglePlayerStrategy;
	const Game = window.Game;
  // Стратегии игры
	const STRATEGIES = {
		 SINGLE: SinglePlayerStrategy,
		// MULTI: MultiPlayerStrategy,
	};
  //
	const mediator = new Mediator;

	class Application {
		constructor() {
			console.info("Application constructor")
			this.views = {
				// finish: new FinishView,
				game: new GameView,
			};

			this._subscribed = [];
			this.game = null;
			this.opts = null;

			// this.subscribe(EVENTS.OPEN_FINISH_VIEW, 'finishGame');
			// this.subscribe(EVENTS.OPEN_GAME_VIEW, 'startGame');
			this.subscribe(EVENTS.MODE_CHOOSED, this.onGreet.bind(this)); //'onGreet'
			// this.subscribe(EVENTS.DESTROY_APP, 'destroy');
		}

		start() {
			console.log("start")
			this.views.game.show();
			// TODO it must be in menu
      mediator.emit(EVENTS.MODE_CHOOSED, {username:"TestUser", mode: "single"});//this.mediator.emit(EVENTS.MODE_CHOOSED, {username, mode});
		}



		onGreet(payload) {
			const gamemode = (payload.mode || '').toUpperCase();
			const username = (payload.username || '').toUpperCase();
			if (gamemode && STRATEGIES[gamemode]) {
				console.log(gamemode);
				const Strategy = STRATEGIES[gamemode];
				this.opts = {Strategy, username};
				console.log(this.opts);
				const gameCanvas = this.views.game.canvas;
				this.game = new Game(Strategy, username, gameCanvas);

				this.unSubscribe(EVENTS.MODE_CHOOSED,this.onGreet);
				// this.waitOpponent();
			}
		}
    //
		subscribe(event, callback) {
			mediator.on(event, callback);
		}
    //
		unSubscribe(event, func) {
			// this._subscribed = this._subscribed.filter(data => data.name !== event);
			mediator.off(event, func);
		}
    //
		// destroy() {
		// 	this._subscribed.forEach(data => mediator.off(data.name, this.mediatorCallback));
		// 	this._subscribed = null;
		// }
	}

	return Application;
})(window);
