export class Middleware {
  constructor() {
    this.handle = this.handle.bind(this);
  }

  handle(_request, _response, next) {
    next();
  }
};
