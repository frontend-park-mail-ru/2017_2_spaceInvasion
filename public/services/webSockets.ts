import {MAX_EVENTS, SIDE, WEB_SOCKETS_BASE_URL} from '../utils/constants';
import emitter from '../modules/emitter';
import userService from './userService';
import {getTheme} from '../modules/themes';
import Strategy from '../modules/game/strateges/strategy';
import {isNumber} from '../utils/utils';

const swal = require('sweetalert2');

class WebSocketsService {
  public static readonly BaseUrl = WEB_SOCKETS_BASE_URL;
  private static instance: WebSocketsService;
  protected handlers = new Map<number, Array<(...data: any[]) => void>>();
  protected wsEvents: Map<string, (event: Event) => any> = new Map();
  protected socket: WebSocket;
  protected eventStack: any[] = [];

  constructor() {
    if (WebSocketsService.instance) {
      return WebSocketsService.instance;
    }

    WebSocketsService.instance = this;
  }

  protected static dataIsValid(data: any): boolean {
    return (data instanceof Array) && data.every((el: any) => isNumber(el)); // && data.data.length >= 1;
  }

  private static error(): void {
    swal({
      titleText: 'Error occurred',
      type: 'error',
      text: 'Protocol Error'
    });
  }

  destroy(): void {
    this.wsEvents.forEach((handler, name) => {
      this.socket.removeEventListener(name, handler);
    });
    this.socket.close();
  }

  init(): void {
    this.socket = new WebSocket(WebSocketsService.BaseUrl);

    this.addEventListener('open', () => {
      const user = userService.user;
      emitter.emit('Game.join', user, getTheme() === 'man' ? SIDE.MAN : SIDE.ALIEN);
    });

    this.addEventListener('close', e => {
      const event = e as CloseEvent;
      let victory = false;
      if (!event.wasClean) {
        // Error on server side
        swal({
          titleText: 'Server is unavailable',
          type: 'error',
          text: `${event.reason} (${event.code})`
        });
      }
      // You are lose, because you are disconnected
      emitter.emit('Game.onFinishGame', victory);
    });

    this.addEventListener('message', e => {
      const event = e as MessageEvent;
      const data = JSON.parse(event.data);
      if (~[1, 4, 5, 6, 10].indexOf(data[1]))

      // Rollback
        if (data.data[1] === 1) {
          this.rollback(data.data[0]);
          return;
        }

      const handlers = this.handlers.get(data.data[1]);
      if (handlers === undefined || !WebSocketsService.dataIsValid(data.data)) {
        WebSocketsService.error();
        return;
      }

      this.eventStack = this.eventStack.slice(data.data[0]);
      handlers.forEach(h => h(data.data.slice(2)));
    });

    this.addEventListener('error', () => WebSocketsService.error);
  }

  subscribe(type: number, handler: (data: any) => void): void {
    let handlers = this.handlers.get(type);
    if (!handlers) {
      handlers = [];
    }

    const wrapper = (data: any) => {
      if (!WebSocketsService.dataIsValid(data)) {
        WebSocketsService.error();
      }
      return handler(data);
    };

    handlers.push(wrapper);
    this.handlers.set(type, handlers);
  }

  send(data: any): void {
    if (this.eventStack.length <= MAX_EVENTS) {
      this.eventStack.push(data);
      this.socket.send(JSON.stringify(data));
    } else {
      // throw Error('Server is not responding for a long time, check your Internet connection');
    }
  }

  rollback(id: number) {
    const notAppliedEvents = this.eventStack.slice(id + 2);
    this.eventStack = this.eventStack.slice(0, id + 2);

    notAppliedEvents.forEach(event => {
      emitter.emit('Strategy.rollbackEvent', event.data);
    });

    this.send({
      class: 'ClientSnap',
      request: [
        emitter.emit('Strategy.lastID')[0],
        5 // AcceptRollback
      ]
    });
  }

  private addEventListener(name: string, handler: (event: Event) => any): void {
    const bindedHandler = handler.bind(this);
    this.wsEvents.set(name, bindedHandler);
    this.socket.addEventListener(name, bindedHandler);
  }
}

export {WebSocketsService};
const webSocketService = new WebSocketsService();
export default webSocketService;
