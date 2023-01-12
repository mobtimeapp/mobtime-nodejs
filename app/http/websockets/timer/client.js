import { app } from 'providers:appService.js';

import { Websocket } from 'websockets:websocket.js';
import { Timer } from 'topics:timer.js';

export default class Client extends Websocket {
  #websocket = null;
  #timerId = null;
  #clientId = null;

  constructor() {
    super([
      'contracts:cache.js',
    ]);
  }

  async validate(params, cache) {
    const connectionKey = `connection:${params.clientId}`;
    return params.timerId
      && (await cache.has(connectionKey))
      && (await cache.get(connectionKey)) === params.timerId;
  }

  async handle(websocket, params) {
    super.handle(websocket, params);

    this.#websocket = websocket;
    this.#timerId = params.timerId;
    this.#clientId = params.clientId;

    app.make(Timer, this.#timerId).subscribe(this.onTimerMessage.bind(this));
  }

  onWebsocketMessage(_event) {
    app.withDependencies(['log'], (log) => {
      log.info('Ignored websocket message from client ', this.#clientId, ' on timer ', this.#timerId, ', socket is read-only');
    });
  }

  onTimerMessage(payload) {
    app.withDependencies(['log'], (log) => {
      log.info('Websocket client', this.#clientId, ' will recv ', JSON.stringify(payload));
    });
    this.#websocket.send(payload);
  }
};
