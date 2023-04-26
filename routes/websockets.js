import { socket } from 'routes:lib/websocket.js';
import { Route } from 'routes:lib/shared.js';

export const routes = Route.group({}, [
  Route.ws('/websocket/:connectionId/timer/:timerId', socket('timer/client.js')),
]);
