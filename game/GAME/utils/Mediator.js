window.Mediator = (function (window) {

  const Emitter = window.Emitter;


  class Mediator {
    constructor() {
      if (Mediator.__instance) {

        return Mediator.__instance;
      }
      Mediator.__instance = this;
      this.__emitter = new Emitter({});
    }

    static initialize() {
      new Mediator;
    }

    // Добавить обработчик события
    on(eventName, func) {
      this.__emitter.subscribe(eventName, func);
    }

    emit(eventName, payload = null) {
      this.__emitter.emit(eventName, payload);
    }

    off(eventName, func) {
      this.__emitter.unSubscribe(eventName, func);
    }
  }

  return Mediator;
})(window);