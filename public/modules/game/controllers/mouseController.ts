import {EVENT} from '../../../utils/constants';
import ControllerInterface from './controllerInterface';

class MouseController implements ControllerInterface {
  protected mouseEvents: Map<EVENT, boolean>;
  protected previousMouseEvents: Map<EVENT, boolean>;
  private handlers = new Map<string, (...args: any[]) => any>();

  protected static map(event: MouseEvent): EVENT {
    throw Error('Not implemented');
  }

  init(): void {
    const bindedMouseUpHandler = this.mouseUpHandler.bind(this);
    const bindedMouseDownHandler = this.mouseDownHandler.bind(this);
    document.addEventListener('mouseup', bindedMouseUpHandler);
    document.addEventListener('mousedown', bindedMouseDownHandler);
    this.handlers.set('mouseup', bindedMouseUpHandler);
    this.handlers.set('mousedown', bindedMouseDownHandler);
  }

  diff(): EVENT[] {
    const clicked = [
      ...Array.from(this.previousMouseEvents.keys()),
      ...Array.from(this.mouseEvents.keys())
    ].filter((key, pos, all) => !~all.indexOf(key, pos + 1))
      .filter(key => Boolean(this.mouseEvents.get(key)) !== Boolean(this.previousMouseEvents.get(key)));
    this.previousMouseEvents = new Map(this.mouseEvents);
    return clicked;
  }

  is(event: EVENT): boolean {
    return Boolean(this.mouseEvents.get(event));
  }

  getEvents(): Map<EVENT, boolean> {
    return this.mouseEvents;
  }

  resetEvent(event: EVENT): void {
    this.previousMouseEvents.set(event, false);
  }

  destroy(): void {
    const mouseup = this.handlers.get('mouseup');
    if (mouseup) {
      document.removeEventListener('mouseup', mouseup);
    }

    const mousedown = this.handlers.get('mousedown');
    if (mousedown) {
      document.removeEventListener('mousedown', mousedown);
    }
  }

  private mouseUpHandler(event: MouseEvent): void {
    this.mouseEvents.set(MouseController.map(event), true);
  }

  private mouseDownHandler(event: MouseEvent): void {
    this.mouseEvents.set(MouseController.map(event), false);
  }
}

export default MouseController;
