import {EVENT} from '../../../utils/constants';
import ControllerInterface from './controllerInterface';

class MouseController implements ControllerInterface {
  protected mouseEvents: Map<EVENT, boolean>;
  protected previousMouseEvents: Map<EVENT, boolean>;
  private handlers = new Map<string, (...args: any[]) => any>();

  protected static map(event: MouseEvent): EVENT {
    throw Error('Not implemented');
  }

  init() {
    const bindedMouseUpHandler = this.mouseUpHandler.bind(this);
    const bindedMouseDownHandler = this.mouseDownHandler.bind(this);
    document.addEventListener('mouseup', bindedMouseUpHandler);
    document.addEventListener('mousedown', bindedMouseDownHandler);
    this.handlers.set('mouseup', bindedMouseUpHandler);
    this.handlers.set('mousedown', bindedMouseDownHandler);
  }

  diff(): Map<EVENT, boolean> {
    const clicked = [
      ...Array.from(this.previousMouseEvents.keys()),
      ...Array.from(this.mouseEvents.keys())
    ].filter((key, pos, all) => ~all.indexOf(key, pos + 1)).reduce((res: Map<EVENT, boolean>, key) => {
      res.set(key, !!this.mouseEvents.get(key));
      return res;
    }, new Map());
    this.previousMouseEvents = new Map(this.mouseEvents);
    return clicked;
  }

  is(event: EVENT): boolean {
    return !!this.mouseEvents.get(event);
  }

  destroy() {
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
