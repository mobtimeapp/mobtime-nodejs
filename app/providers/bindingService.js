import { Service } from 'contracts:service.js';

import * as localPublisher from 'publishers:local.js';

import * as http from 'package:servers/http.js';
import Pool from 'websocket:pool.js';

export default class BindingService extends Service {
  async boot() {
    await this.app.bind('http', () => http.singleton);
  }

  async register() {
    await this.app.bind('publisher:local', () => localPublisher.singleton);
    await this.app.singleton('websocket:pool.js', new Pool());
  }
};
