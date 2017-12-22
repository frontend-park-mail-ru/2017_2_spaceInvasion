class Emitter {
  private events = new Map<string, Array<(...data: any[]) => any>>();

  attach(event: string, callback: (...data: any[]) => any): void {
    this._run('attach', event, callback);
  }

  detach(event: string, callback: (...data: any[]) => any): void {
    this._run('detach', event, callback);
  }

  emit(event: string, ...data: any[]): any {
    return this._run('emit', event, data);
  }

  private _attach(event: string, callback: (...data: any[]) => any): void {
    let events = this.events.get(event) || [];
    events.push(callback);
    this.events.set(event, events);
  }

  private _detach(event: string, callback: (...data: any[]) => any): void {
    const events = this.events.get(event) || [];
    let detached = 0;
    for (let i = events.indexOf(callback); ~i; detached++) {
      events.splice(i, 1);
      i = events.indexOf(callback);
    }

    if (detached === 0) {
      throw Error('Try to delete unsubscribed event: ' + event);
    }
  }

  private _emit(event: string, data: any[]): any {
    const events = this.events.get(event);
    if (!events) {
      throw Error('Try to emit unsubscribed event: ' + event);
    }
    const result: any[] = [];
    events.forEach(e => result.push(e(...data)));
    return result;
  }

  private _run(action: string, event: string[] | string, data: ((...data: any[]) => any) | any[]): any {
    if (Array.isArray(event)) {
      event.forEach(e => this._run(action, e, data), this);
    } else {
      switch (action) {
        case 'attach':
          this._attach(event, data as (data: any) => any);
          break;
        case 'detach':
          this._detach(event, data as (data: any) => any);
          break;
        case 'emit':
          return this._emit(event, data as any[]);
        default:
          throw Error('Internal Error');
      }
    }
  }

}

const emitter = new Emitter();
export {Emitter};
export default emitter;