import {SIDE, WEB_SOCKETS_BASE_URL, MAX_EVENTS} from '../utils/constants';
import emitter from '../modules/emitter';
import PNotify from '../utils/notifications';
import userService from './userService';
import {getTheme} from '../modules/themes';
import Strategy from '../modules/game/strateges/strategy';
import {isNumber} from '../utils/utils';

class WebSocketsService {
  public static readonly BaseUrl = WEB_SOCKETS_BASE_URL;
  protected handlers = new Map< number, Array<(...data: any[]) => void> >();
  protected socket: WebSocket;
  protected eventStack: any[] = [];
  private static instance: WebSocketsService;

  constructor() {
    if (WebSocketsService.instance) {
      return WebSocketsService.instance;
    }

    WebSocketsService.instance = this;
  }

  protected static dataIsValid(data: any): boolean {
    return (data instanceof Array) && data.every((el: any) => isNumber(el)); // && data.data.length >= 1;
  }

  init(): void {
    this.socket = new WebSocket(WebSocketsService.BaseUrl);

    this.socket.onopen = () => {
      const user = userService.user;
      emitter.emit('Game.join', user, getTheme() === 'man' ? SIDE.MAN : SIDE.ALIEN);
    };

    this.socket.onclose = (event) => {
      let victory = false;
      if (!event.wasClean) {
        // Error on server side
        new PNotify({
          title: 'Server is unavailable',
          type: 'error',
          message: `${event.reason} (${event.code})`
        });
        victory = true;
      }
      // You are lose, because you are disconnected
      emitter.emit('Game.onFinishGame', victory);
    };

    this.socket.onmessage = (function (this: WebSocketsService, event: MessageEvent) {
      const data = JSON.parse(event.data);
      console.log(data);

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
    }).bind(this);

    this.socket.onerror = WebSocketsService.error;
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
      throw Error('Server is not responding for a long time, check your Internet connection');
    }
  }

  rollback(id: number) {
    const notAppliedEvents = this.eventStack.slice(id + 2);
    this.eventStack = this.eventStack.slice(0, id + 2);

    notAppliedEvents.forEach(event => {
      emitter.emit('Strategy.rollbackEvent', event.data);
    });
  }

  private static error(): void {
    new PNotify({
      title: 'Error occurred',
      type: 'error',
      message: 'Protocol Error'
    });
  }
}

export {WebSocketsService};
const webSocketService = new WebSocketsService();
export default webSocketService;
