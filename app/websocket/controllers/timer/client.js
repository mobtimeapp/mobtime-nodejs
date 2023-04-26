// import { app } from 'providers:appService.js';
import { app } from 'package:bootstrap/app.js';
import Binding from 'helpers:binding.js';

import { Websocket } from 'contracts:websocket.js';
// import { Timer } from 'topics:timer.js';

import { isFuture } from 'date-fns';

export default class extends Websocket {
  websocket = null;
  timerId = null;
  connectionId = null;

  constructor() {
    super([
      'contracts:log.js',
      '@prisma/client',
    ]);

    new Binding(this, 'onWebsocketMessage', ['contracts:log.js']);
    new Binding(this, 'onTimerMessage', ['contracts:log.js']);
    new Binding(this, 'onWebsocketConnected', ['websocket:pool.js', '@prisma/client']);
    new Binding(this, 'handle', ['@prisma/client']);
  }

  getConnection(params, db) {
    return db.connection.findFirst({
      where: {
        connectionId: params.connectionId,
        timerId: params.timerId,
      }
    });
  }

  async validate(params, log, db) {
    const connection = this.getConnection(params, db);

    if (!connection) {
      log.info('Websocket.validate', 'no matching connection', params);
      return false;
    }

    if (!isFuture(connection.timeoutAt)) {
      log.info('Websocket.validate', 'timeout occured', params);
      return false;
    }

    return true;
  }

  async handle(websocket, params, db) {
    super.handle(websocket, params);

    this.websocket = websocket;
    this.timerId = params.timerId;
    this.connectionId = params.connectionId;

    this.onWebsocketConnected(params);

    // app.make(Timer, this.timerId).subscribe(this.onTimerMessage.bind(this));
  }

  onWebsocketPing() {
  }

  onWebsocketConnected(params, pool, db) {
    const connection = this.getConnection(params, db);
    if (!connection) {
      console.error('something went wrong');
    }

    pool.track(this.connectionId, this.websocket);
    db.connection.update({
      where: { id: connection.id },
      data: {
      },
    });
  }

  onWebsocketMessage(_event, log) {
    //log.info('Ignored websocket message from client ', this.connectionId, ' on timer ', this.timerId, ', socket is read-only');
    log.info('Ignored websocket message from client ', this.connectionId, ' on timer ', this.timerId, ', socket is read-only');
  }

  onTimerMessage(payload, log) {
    // log.info('Websocket client', this.connectionId, ' will recv ', JSON.stringify(payload));
    console.log('Websocket client', this.connectionId, ' will recv ', JSON.stringify(payload));
    this.websocket.send(payload);
  }
};
