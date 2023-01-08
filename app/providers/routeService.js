import { app } from 'package:bootstrap/app.js';

import { Service } from 'interfaces:service.js';

import { routes } from 'routes:api.js';

export default class RouteService extends Service {
  async register() {
    const http = await app.make('http');

    this.mapRoutes([].concat(routes), http);
  }

  mapRoutes(routes, http) {
    console.log('routeService.mapRoutes', routes);
    for (const route of routes) {
      if (route.getChildren) {
        return this.mapRoutes(route.getChildren(), http);
      }
      http.map(route.getPath(), route);
    }
  }
};
