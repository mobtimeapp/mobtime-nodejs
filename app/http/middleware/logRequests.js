import { Middleware } from 'contracts:middleware.js';

export default class LogRequests extends Middleware {
  constructor() {
    super(['contracts:log.js']);
  }

  handle(request, next, log) {
    log.log(`Http.request => ${request.method} ${request.url}`);
    return next(request);
  }
};
