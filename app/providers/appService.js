import { Service } from 'interfaces:service.js';

import * as broadcaster from 'publishers:local.js';

export default class AppService extends Service {
  #app = null;

  constructor(app) {
    super();
    this.#app = app;
  }

  async boot() {
  }

  async register() {
    this.#app.bind('broadcaster', () => broadcaster.singleton);
  }
};
