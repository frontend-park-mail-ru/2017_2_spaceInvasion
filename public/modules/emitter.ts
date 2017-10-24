(function emitterHandler() {
  const Emitter = {
    events: {},
    Run(action, event, data) {
      if (event.constructor === Array) {
        let i = 0;
        const l = event.length;
        while (i < l) {
          this.Run(action, event[i], data);
          i += 1;
        }
        return;
      }
      if (event.constructor !== String) {
        return;
      }
      this[action](event, data);
    },
    attach(event, callback) {
      this.Run('RunAttach', event, callback);
    },
    detach(event, callback) {
      this.Run('RunDetach', event, callback);
    },
    emit(event, data) {
      this.Run('RunEmit', event, data);
    },

    RunAttach(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
    },
    RunEmit(event, data) {
      const events = this.events[event];
      if (events) {
        let i = 0;
        const l = events.length;
        while (i < l) {
          events[i](data);
          i += 1;
        }
      }
    },
    RunDetach(event, callback) {
      const events = this.events[event];
      let index;
      if (events) {
        index = events.indexOf(callback);
        if (index > -1) {
          events.splice(index, 1);
        }
      }
    },
  };
  window.EventEmitter = Emitter;
}());
