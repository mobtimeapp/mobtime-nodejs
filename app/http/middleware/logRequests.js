import { Middleware } from 'interfaces:middleware.js';

export default class LogRequests extends Middleware {
  constructor() {
    super(['log']);
  }

  handle(request, next, log) {
    log.log(`Http.request => ${request.method} ${request.url}`);
    return next(request);
  }
};
