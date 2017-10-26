window.Emitter = (function () {

  class Emitter {

    constructor (events) {
      this.__events = events;
    }

    // Подписаться на событие
    subscribe (eventName, func) {
      if (!this.__events[eventName]) {
        this.__events[eventName] = [];
      }
      this.__events[eventName].push(func);
    }

    emit (eventName, data) {
      const event = this.__events[eventName];
      if (event) {
        event.forEach(fn => {
          fn.call(null, data);
        });
      }
    }


    unSubscribe(eventName, func){
      this.__events[eventName] = this.__events[eventName].filter(eventFn => eventFn !== func);
    }
  }

  return Emitter;
})(window);