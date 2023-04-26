import Controller from 'contracts:controller.js';
import { Json } from 'http:response/Json.js';

import Timer from 'models:timer.js';

export default class Show extends Controller {
  constructor() {
    super([
      'contracts:cache.js',
      'contracts:log.js',
    ]);
  }

  async invoke(request, cache, log) {
    const timerId = request.params('timerId');

    let state = await cache.get(Timer.getCacheKey(timerId));

    if (!state) {
      state = {
        public: {
          mob: [],
          notes: '',
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
      await cache.put(Timer.getCacheKey(timerId), JSON.stringify(state), Timer.stateCacheTTL);
      log.info('Created new timer');
    } else {
      state = JSON.parse(state);
      log.info('Using already created timer');
    }

    return new Json({
      timerId,
      state,
    }, Json.STATUS_OK);
  }
}
