import { Service } from 'interfaces:service.js';

import { mapping } from 'config:providers.js';

export default class AppService extends Service {
  #app = null;

  constructor(app) {
    super();
    this.#app = app;
  }

  async boot() {
  }

  async register() {
  }
};
