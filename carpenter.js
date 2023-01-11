import process from 'node:process';

import { app } from 'package:bootstrap/app.js';

import AppService from 'providers:appService.js';

import { singleton } from 'console:kernel.js';

const serviceClasses = [
  AppService,
];

const init = async () => {
  const services = serviceClasses.map(serviceClass => new serviceClass(app));
    
  for (const service of services) {
    await service.boot();
  }

  for (const service of services) {
    await service.register();
  }

  const kernel = singleton(app);
  return kernel.handle(process.argv[2], process.argv.slice(3));
};

init();
