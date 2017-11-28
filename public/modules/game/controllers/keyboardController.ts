import {ACTION_MAPPER, EVENT} from '../../../utils/constants';
import ControllerInterface from './controllerInterface';

class KeyboardController implements ControllerInterface {
  protected keys = new Map<EVENT, boolean>();
  protected previousKeys = new Map<EVENT, boolean>();
  private handlers = new Map<string, (...args: any[]) => any>();

  protected static map(event: KeyboardEvent): EVENT {
    event.preventDefault();
    let res = ACTION_MAPPER.get(event.key);
    if (res === undefined) {
      res = EVENT.NO;
    }
    return res;
  }

  init(): void {
    const bindedKeyDownHandler = this.keyDownHandler.bind(this);
    const bindedKeyUpHandler = this.keyUpHandler.bind(this);
    this.handlers.set('keydown', bindedKeyDownHandler);
    this.handlers.set('keyup', bindedKeyUpHandler);
    document.addEventListener('keydown', bindedKeyDownHandler);
    document.addEventListener('keyup', bindedKeyUpHandler);
  }

  diff(): Map<EVENT, boolean> {
    const pressed = [
      ...Array.from(this.previousKeys.keys()),
      ...Array.from(this.keys.keys())
    ].filter((key, pos, all) => ~all.indexOf(key, pos + 1))
      .reduce(
        (res: Map<EVENT, boolean>, key) => res.set(key, !this.previousKeys.get(key) && !!this.keys.get(key)),
        new Map()
      );

    this.previousKeys = new Map(this.keys);
    return pressed;
  }

  getKeys(): Map<EVENT, boolean> {
    return this.keys;
  }

  is(key: EVENT): boolean {
    return this.keys.get(key) || false;
  }

  destroy(): void {
    const keydown = this.handlers.get('keydown');
    if (keydown) {
      document.removeEventListener('keydown', keydown);
    }

    const keyup = this.handlers.get('keyup');
    if (keyup) {
      document.removeEventListener('keyup', keyup);
    }
  }

  private keyDownHandler(event: KeyboardEvent): void {
    this.keys.set(KeyboardController.map(event), true);
  }

  private keyUpHandler(event: KeyboardEvent): void {
    this.keys.set(KeyboardController.map(event), false);
  }
}

export default KeyboardController;
