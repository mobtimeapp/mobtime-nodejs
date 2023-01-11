import Injectable from 'helpers:injectable.js';

export class Middleware extends Injectable {
  constructor(dependencies) {
    super();

    this.handle = this.wrapWithDependencies(this.handle.bind(this), dependencies);
  }

  handle(request, next) {
    return next(request);
  }
};
