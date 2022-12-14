import { app } from 'package:bootstrap/app.js';
import Injectable from 'helpers:injectable.js';

export default class Controller extends Injectable {
  constructor(dependencies) {
    super(app);

    this.invoke = this.wrapWithDependencies(this.invoke.bind(this), dependencies);
  }

  async invoke(_request) {
    throw new RuntimeException('Controller does not implement invoke');
  }
};
