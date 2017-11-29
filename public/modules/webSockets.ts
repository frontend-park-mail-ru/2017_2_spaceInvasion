import {WEB_SOCKETS_BASE_URL} from '../utils/constants';

class WebSocketsService {
  public static readonly BaseUrl = WEB_SOCKETS_BASE_URL;
  protected readonly socket: WebSocket;
  private static instance: WebSocketsService;

  constructor() {
    if (WebSocketsService.instance) {
      return WebSocketsService.instance;
    }

    this.socket = new WebSocket(WebSocketsService.BaseUrl);
    WebSocketsService.instance = this;
  }

  protected init(): void {
    this.socket.onopen = function () {
      alert("Соединение установлено.");
    };

    this.socket.onclose = function (event) {
      if (event.wasClean) {
        alert('Соединение закрыто чисто');
      } else {
        alert('Обрыв соединения'); // например, "убит" процесс сервера
      }
      alert('Код: ' + event.code + ' причина: ' + event.reason);
    };

    this.socket.onmessage = function (event) {
      alert("Получены данные: " + event.data);
    };

    this.socket.onerror = function (error: Event) {
      alert("Ошибка: " + error);
    };
  }

  send(data: number[]): void {
    this.socket.send(JSON.stringify(data));
  }
}

export {WebSocketsService};
const webSocketService = new WebSocketsService();
export default webSocketService;