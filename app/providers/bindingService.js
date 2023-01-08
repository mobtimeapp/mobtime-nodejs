import { app } from 'providers:appService.js';

import { Service } from 'interfaces:service.js';

import { LogFactory } from 'factories:log.js';
import { CacheFactory } from 'factories:cache.js';

import * as localPublisher from 'publishers:local.js';

import * as http from 'package:servers/http.js';

export default class BindingService extends Service {
  async boot() {
    await app.bind('http', () => http.singleton);
  }

  async register() {
    await app.bind('log', () => LogFactory());
    await app.bind('cache', () => CacheFactory());
    await app.bind('publisher:local', () => localPublisher.singleton);
  }
};
