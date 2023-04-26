import { addMinutes } from 'date-fns';

import Controller from 'contracts:controller.js';
import Timer from 'models:timer.js';
import { Json } from 'http:response/Json.js';

import * as httpConfig from 'config:http.js';

import { v4 } from 'uuid';

const WEBSOCKET_CONNECTION_TTL = 30;

export default class Show extends Controller {
  constructor() {
    super([
      '@prisma/client',
      'contracts:cache.js',
    ]);
  }

  async invoke(request, db, cache) {
    const timerId = request.params('timerId');

    console.log('timer/{id}/subscribe', timerId);

    const state = await cache.get(Timer.getCacheKey(timerId));

    if (!state) {
      return new Json({
        message: 'Timer has never been accessed',
      }, Json.STATUS_NOT_FOUND);
    }
    
    const connectionId = v4().toString();

    await db.connection.create({
      data: {
        timerId,
        connectionId,
        connectedAt: null,
        disconnectedAt: null,
        pingedAt: null,
        timeoutAt: addMinutes(new Date(), 3),
      },
    })

    await cache.put(`connection:${connectionId}`, timerId, WEBSOCKET_CONNECTION_TTL);

    return new Json({
      ws: `ws://${httpConfig.host}:${httpConfig.port}/websocket/${connectionId}/timer/${timerId}`,
      expiresAt: parseInt(Date.now() / 1000) + WEBSOCKET_CONNECTION_TTL,
    }, Json.STATUS_OK);
  }
}

