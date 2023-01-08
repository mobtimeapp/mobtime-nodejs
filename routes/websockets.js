import { route, socket } from 'routes:lib/websocket.js';

export const routes = [
  route('/websocket/:clientId/timer/:timerId', socket('timer/client.js')),
];
