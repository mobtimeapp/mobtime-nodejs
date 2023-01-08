import { Middleware } from 'interfaces:middleware.js';

import Request from 'helpers:request.js';

export default class LogRequests extends Middleware {
  handle(request, next) {
    next(new Request(request));
  }
};

