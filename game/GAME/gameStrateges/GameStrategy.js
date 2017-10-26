window.GameStrategy = (function (window) {
  const EVENTS = window.EVENTS;
  const Mediator = window.Mediator;
  const mediator = new Mediator;

  class GameStrategy {
    constructor() {
      console.info('Game Strategy create');
      if (this.constructor.name === GameStrategy.name) {
        throw new TypeError('Can not create instance of GameStrategy');
      }
      // События
      this.subscribe(EVENTS.WE_ARE_LOGGED_IN,this.onLoggedIn.bind(this));
      this.subscribe(EVENTS.NEXT_STEP_CONTROLS_PRESSED, this.onNewCommand.bind(this));

      this.state = null;
    }

    onLoggedIn(payload) {
      console.info('GameStrategy onLoggedIn', arguments);
      throw new TypeError('Not implemented');
    }

    onNewCommand(payload) {
      console.info('GameStrategy onNewCommand', arguments);
      throw new TypeError('Not implemented');
    }

    fireGameOver(message) {
      console.info('GameStrategy fireGameOver', arguments);
      mediator.emit(EVENTS.FINISH_THE_GAME, {message});
    }


    // fireOpponentFound(me, opponent) {
    //   console.log('GameStrategy.fn.fireOpponentFound', arguments);
    //   mediator.emit(EVENTS.SETUP_OPPONENTS, {me, opponent});
    // }

    fireStartGame() {
      console.log('GameStrategy.fn.fireStartGame', arguments);
      mediator.emit(EVENTS.START_THE_GAME);
    }

    fireSetNewGameState(state) {
      mediator.emit(EVENTS.SET_NEW_GAME_STATE, {state});
    }


    subscribe(event, func) {
      mediator.on(event, func);
    }

    unsubscribe(event) {
      this._subscribed = this._subscribed.filter(data => data.name !== event);
      mediator.off(event, this.mediatorCallback);
    }

    destroy() {
      this._subscribed.forEach(data => mediator.off(data.name, this.mediatorCallback));
      this._subscribed = null;

    }
  }

  return GameStrategy;
})(window);