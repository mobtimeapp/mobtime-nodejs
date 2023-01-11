import { app } from 'package:bootstrap/app.js';

import AppService from 'providers:appService.js';
import RouteService from 'providers:routeService.js';

import * as http from 'http:kernel.js';

const serviceClasses = [
  AppService,
  RouteService,
];

const init = async () => {
  app.bind('http', () => http.singleton(app));

  const services = serviceClasses.map(serviceClass => new serviceClass(app));
    
  for (const service of services) {
    await service.boot();
  }

  for (const service of services) {
    await service.register();
  }
};

init();
