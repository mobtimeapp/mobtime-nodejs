import { app } from 'providers:appService.js';

import { Service } from 'contracts:service.js';

import * as localPublisher from 'publishers:local.js';

import * as http from 'package:servers/http.js';

export default class BindingService extends Service {
  async boot() {
    await app.bind('http', () => http.singleton);
  }

  async register() {
    await app.bind('publisher:local', () => localPublisher.singleton);
  }
};
