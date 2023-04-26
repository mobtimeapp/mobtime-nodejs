import Binding from 'helpers:binding.js';

const PING_INTERVAL = 1 * 60 * 1000;
const PING_TIMEOUT = 10 * 1000;

export class Websocket {
  #pingInterval = null;
  #pingTimeout = null;
  #websocket = null;

  constructor(dependencies) {
    new Binding(this, 'validate', dependencies);
    new Binding(this, 'handle', dependencies);
  }

  get websocket() {
    return this.#websocket;
  }

  async validate(_params) {
    return true;
  }

  async handle(websocket, params) {
    if (!(await this.validate(params))) {
      return this.onWebsocketInvalid(websocket);
    }

    websocket.addEventListener('message', this.onWebsocketMessage.bind(this));
    websocket.addEventListener('close', this.onWebsocketClose.bind(this));
    websocket.addEventListener('pong', this.onWebsocketPong.bind(this));

    this.#schedulePing(websocket);
  }

  onWebsocketPing() {}

  #ping(websocket) {
    clearTimeout(this.#pingTimeout);

    this.#pingTimeout = setTimeout(
      this.onWebsocketPingTimeout.bind(this),
      PING_TIMEOUT
    );

    websocket.ping();
    this.onWebsocketPing();
  }

  #schedulePing(websocket) {
    clearTimeout(this.#pingInterval);

    this.#pingInterval = setTimeout(
      () => this.#ping(websocket),
      PING_INTERVAL,
    );
  }

  onWebsocketInvalid(websocket) {
    websocket.close();
  }

  onWebsocketMessage(_event) {}

  onWebsocketClose(_event) {}

  onWebsocketPong(_event) {
    this.#schedulePing();
  }

  onWebsocketPingTimeout(websocket) {
    websocket.close();
  }
};
