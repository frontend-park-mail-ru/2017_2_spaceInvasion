import {SIDE, WEB_SOCKETS_BASE_URL, MAX_EVENTS} from '../utils/constants';
import emitter from './emitter';
import PNotify from '../utils/notifications';
import userService from '../services/userService';
import {getTheme} from './themes';
import Strategy from './game/strateges/strategy';

class WebSocketsService {
  public static readonly BaseUrl = WEB_SOCKETS_BASE_URL;
  protected handlers = new Map< string, Array<(...data: any[]) => any> >();
  protected socket: WebSocket;
  protected eventStack: Array<number[]> = [];
  private static instance: WebSocketsService;

  constructor() {
    if (WebSocketsService.instance) {
      return WebSocketsService.instance;
    }

    WebSocketsService.instance = this;
  }

  init(): void {
    this.socket = new WebSocket(WebSocketsService.BaseUrl);

    this.socket.onopen = () => {
      const user = userService.user;
      emitter.emit('Game.join', user, getTheme() === 'man' ? SIDE.MAN : SIDE.ALIEN);
    };

    this.socket.onclose = (event) => {
      if (event.wasClean) {
        // You are lose, because you are disconnected
        emitter.emit('Game.onFinishGame', false);
      } else {
        // Error on server side
        new PNotify({
          title: 'Server is unavailable',
          type: 'error',
          message: `${event.reason} (${event.code})`
        });
      }
    };

    this.socket.onmessage = (function (this: WebSocketsService, event: MessageEvent) {
      const handlers = this.handlers.get(event.type);
      if (!handlers) {
        WebSocketsService.error();
        return;
      }
      this.eventStack = this.eventStack.slice(event.data[0]);
      handlers.forEach(h => h(event.data.slice(1)));
    }).bind(this);

    this.socket.onerror = WebSocketsService.error;
  }

  subscribe(type: string, handler: (event: MessageEvent) => any): void {
    let handlers = this.handlers.get(type);
    if (!handlers) {
      handlers = [];
    }
    handlers.push(handler);
    this.handlers.set(type, handlers);
  }

  send(data: number[]): void {
    if (this.eventStack.length <= MAX_EVENTS) {
      this.eventStack.push(data);
      this.socket.send(JSON.stringify(data));
    } else {
      throw Error('Server is not responding for a long time, check your Internet connection');
    }
  }

  rollback(event: MessageEvent) {
    const lastApprovedEventID = event.data[0];
    const notAppliedEvents = this.eventStack.slice(lastApprovedEventID + 1);
    this.eventStack = this.eventStack.slice(0, lastApprovedEventID + 1);

    notAppliedEvents.forEach(event => {
      emitter.emit('Strategy.rollbackEvent', event);
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