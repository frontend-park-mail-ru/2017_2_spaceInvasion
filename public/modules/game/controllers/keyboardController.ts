import {ACTION_MAPPER, EVENT} from '../../../utils/constants';
import ControllerInterface from './controllerInterface';

class KeyboardController implements ControllerInterface {
  protected keys = new Map<EVENT, boolean>();
  protected previousKeys = new Map<EVENT, boolean>();
  private handlers = new Map<string, (...args: any[]) => any>();
  private static nextIgnoreAction: EVENT|null = null;

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

  diff(): EVENT[] {
    const pressed = [
      ...Array.from(this.previousKeys.keys()),
      ...Array.from(this.keys.keys())
    ].filter((key, pos, all) => !~all.indexOf(key, pos + 1))
      .filter(key => Boolean(this.previousKeys.get(key)) !== Boolean(this.keys.get(key)));

    this.previousKeys = new Map(this.keys);
    return pressed;
  }

  getEvents(): Map<EVENT, boolean> {
    return this.keys;
  }

  is(key: EVENT): boolean {
    return Boolean(this.keys.get(key));
  }

  resetEvent(event: EVENT): void {
    this.previousKeys.set(event, false);
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
