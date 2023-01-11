import Controller from 'controllers:controller.js';
import { Json } from 'package:src/http/response/Json.js';

import { app } from 'providers:appService.js';

import * as httpConfig from 'config:http.js';

import { v4 } from 'uuid';

const WEBSOCKET_CONNECTION_TTL = 30;

export default class Show extends Controller {
  async invoke(request) {
    const timerId = request.input('timerId');
    const key = `timer:${timerId}`;

    return app.withDependencies(['cache'], async (cache) => {
      const state = await cache.get(key);

      if (!state) {
        return new Json({
          message: 'Timer has never been accessed',
        }, Json.STATUS_NOT_FOUND);
      }

      const uuid = v4().toString();

      await cache.put(`connection:${uuid}`, timerId, WEBSOCKET_CONNECTION_TTL);

      return new Json({
        ws: `ws://${httpConfig.host}:${httpConfig.port}/websocket/${uuid}/timer/${timerId}`,
        expiresAt: parseInt(Date.now() / 1000) + WEBSOCKET_CONNECTION_TTL,
      }, Json.STATUS_OK);
    });
  }
}

