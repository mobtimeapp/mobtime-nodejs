import Injectable from 'helpers:injectable.js';

const PING_INTERVAL = 1 * 60 * 1000;
const PING_TIMEOUT = 10 * 1000;

export class Websocket extends Injectable {
  #pingInterval = null;
  #pingTimeout = null;
  #websocket = null;

  constructor(dependencies) {
    this.validate = this.wrapWithDependencies(this.validate.bind(this), dependencies);
    this.handle = this.wrapWithDependencies(this.handle.bind(this), dependencies);
  }

  get websocket() {
    return this.#websocket;
  }

  async validate(_params) {
    return true;
  }

  async handle(websocket, params) {
    this.#websocket = websocket;
    if (!(await this.validate(params))) {
      return this.onWebsocketInvalid();
    }

    this.#websocket.addEventListener('message', this.onWebsocketMessage.bind(this));
    this.#websocket.addEventListener('close', this.onWebsocketClose.bind(this));
    this.#websocket.addEventListener('pong', this.onWebsocketPong.bind(this));

    this.#schedulePing();
  }

  #ping() {
    clearTimeout(this.#pingTimeout);

    this.#pingTimeout = setTimeout(
      this.onWebsocketPingTimeout.bind(this),
      PING_TIMEOUT
    );

    this.#websocket.ping();
  }

  #schedulePing() {
    clearTimeout(this.#pingInterval);

    this.#pingInterval = setTimeout(
      () => this.#ping(),
      PING_INTERVAL,
    );
  }

  onWebsocketInvalid() {
    this.#websocket.close();
  }

  onWebsocketMessage(_event) {}

  onWebsocketClose(_event) {}

  onWebsocketPong(_event) {
    this.#schedulePing();
  }

  onWebsocketPingTimeout() {
    this.#websocket.close();
  }
};
