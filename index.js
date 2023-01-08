import { app } from './bootstrap/app.js';
import AppService from 'providers:appService.js';
import RouteService from 'providers:routeService.js';

const serviceClasses = [
  AppService,
  RouteService,
];

const init = async () => {
  const services = serviceClasses.map(serviceClass => new serviceClass(app));
    
  for (const service of services) {
    await service.boot();
  }

  for (const service of services) {
    await service.register();
  }
};

init();
