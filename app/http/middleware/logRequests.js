import { app } from 'providers:appService.js';

import { Middleware } from 'interfaces:middleware.js';

export default class LogRequests extends Middleware {
  handle(request, next) {
    return app.withDependencies(['log'], (log) => {
      log.log(`Http.request => ${request.method} ${request.url}`);
      next();
    });
  }
};
