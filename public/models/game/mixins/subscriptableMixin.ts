import emitter from '../../../modules/emitter';

class SubscriptableMixin {
  protected handlers = new Map<string, (data: any) => any>();

  protected subscribe(event: string, callback: (data: any) => any): void {
    const binded = callback.bind(this);
    this.handlers.set(event, binded);
    emitter.attach(event, binded);
  }

  protected destroy(): void {
    this.handlers.forEach((handler, event) => {
      emitter.detach(event, handler)
    });
  }
}

export default SubscriptableMixin;