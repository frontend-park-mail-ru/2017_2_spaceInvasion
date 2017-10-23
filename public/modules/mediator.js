const mediator = (function mediatorHandler() {
  const subscribe = function subscribeHandler(channel, func) {
    if (!mediator.channels[channel]) {
      mediator.channels[channel] = [];
    }
    mediator.channels[channel].push({
      context: this,
      callback: func,
    });
    return this;
  };

  const apply = function applyHandler(channel, ...args) {
    if (!mediator.channels[channel]) {
      return false;
    }
    // const args = Array.prototype.slice.call(arguments, 1);
    // не знаю, будет без этого работать или нет. Все вопросы к fix-lint
    let i = 0;
    const l = mediator.channels[channel].length;
    while (i < l) {
      const subscription = mediator.channels[channel][i];
      subscription.callback.apply(subscription.context, args);
      i += 1;
    }
    return this;
  };

  return {
    channels: {},
    apply,
    subscribe,
    connectTo(obj) {
      obj.subscribe = subscribe;
      obj.apply = apply;
    },

  };
}());
