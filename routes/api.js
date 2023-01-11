import { Route } from 'routes:lib/shared.js'
import { controller } from 'routes:lib/controller.js';

export const routes = Route.group({}, [
  Route.get('/', controller('index.js'))
    .name('index')
    .description('Shows API documentation')
    .statusCodes({ 200: 'List API routes' }),

  Route.group({ prefix: '/timer/:timerId', as: 'timer.', }, [
    Route.get('/', controller('timer/show.js'))
      .name('show')
      .description('Get current timer state')
      .statusCodes({ 200: 'Timer State' }),
    Route.get('/subscribe', controller('timer/subscribe/show.js'))
      .name('show')
      .description('Get a temporary websocket token to connect to a timer')
      .statusCodes({
        200: 'OK',
      }),
  ]),
])
