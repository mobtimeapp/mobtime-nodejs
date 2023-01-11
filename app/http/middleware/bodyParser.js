import { Middleware } from 'interfaces:middleware.js';

export default class BodyParser extends Middleware {
  constructor() {
    super();
  }

  handle(request, next) {
    return request.readPostBody()
      .then(() => next(request));
  }
};
