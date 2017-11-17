class Emitter {
  private events : Map<string, Array<(data : object) => void>>;

  _run(action : string, event : string[]|string, data : ((data : object) => void)|object) : void {
    if (Array.isArray(event)) {
      event.forEach(e => this._run(action, e, data), this);
    } else {
      switch (action) {
        case 'attach':
          this._attach(event, data as (data : object) => void);
          break;
        case 'detach':
          this._detach(event);
          break;
        case 'emit':
          this._emit(event, data as object);
          break;
        default:
          break;
      }
    }
  }

  attach(event : string, callback : (data : object) => void) : void {
    this._run('attach', event, callback);
  }

  detach(event : string) : void {
    this._run('detach', event, {});
  }

  emit(event : string, data : object) : void {
    this._run('emit', event, data);
  }

  _attach(event : string, callback : (data : object) => void) : void {
    let events = this.events.get(event) || [];
    events.push(callback);
    this.events.set(event, events);
  }

  _emit(event : string, data : object) : void {
    const events = this.events.get(event);
    if (events) {
      events.forEach(e => e(data));
    }
  }

  _detach(event : string) : void {
    this.events.delete(event);
  }
}

export default Emitter;