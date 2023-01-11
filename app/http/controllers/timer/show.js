import Controller from 'interfaces:controller.js';
import { Json } from 'http:response/Json.js';

export default class Show extends Controller {
  constructor() {
    super([
      'cache',
      'log',
    ]);
  }

  async invoke(request, cache, log) {
    const timerId = request.params('timerId');
    const key = `timer:${timerId}`;

    let state = await cache.get(key);

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
      await cache.put(key, JSON.stringify(state), 3 * 24 * 60 * 60 * 1000);
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
