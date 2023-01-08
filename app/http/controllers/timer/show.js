import Controller from 'controllers:controller.js';
import { Json } from 'http:response/Json.js';

import { app } from 'package:bootstrap/app.js';

export default class Show extends Controller {
  dependencies = [
    'cache',
    'log',
    'publisher:local',
  ];

  async invoke(request, cache, log, publisher) {
    console.log('show', { request, cache, log, publisher });
    const timerId = request.input('timerId');
    const key = `timer:${timerId}`;

    let state = await cache.get(key);

    if (!state) {
      state = {
        public: {
          mob: [],
          goals: [],
          timer: {
            duration: null,
            startedAt: null,
          },
          settings: {
            duration: 5 * 60 * 1000,
            mobOrder: 'driver,navigator',
          },
        },
        connections: [],
        createdAt: Date.now(),
      };
      await cache.put(key, JSON.stringify(state), 3 * 24 * 60 * 60 * 1000);
      log.info('Created new timer');
    } else {
      state = JSON.parse(state);
      log.info('Using already created timer');
    }

    setTimeout(() => publisher.publish(key, 'yoooo'), 5000);

    return new Json({
      timerId,
      state,
    }, Json.STATUS_OK);
  }
}
