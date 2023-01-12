import UrlPattern from 'url-pattern';

import { Service } from 'contracts:service.js';
import { routes } from 'routes:api.js';
import { Group } from 'routes:lib/shared.js';


export default class RouteService extends Service {
  app = null;

  constructor(app) {
    super();
    this.app = app;
  }

  async register() {
    const kernel = await this.app.make('http:kernel.js');
    kernel.setRouteFinderFn(this.routeAndMatches.bind(this));
    console.log('RouteService.register');
  }

  routeAndMatches(path, all = null) {
    const collection = all || this.all;
    console.log('RouteService.routeAndMatches', path, collection);
    for (const route of collection) {
      console.log(route, route.getPath(), path);
      if (route instanceof Group) {
        const result = this.routeAndMatches(path, route.getChildren());
        if (result) return result;
        continue;
      }

      const matches = route.match(path);
      console.log(' -- ', matches);
      if (!matches) continue;

      return { route, matches };
    }
    return null;
  }

  get all() {
    return [].concat(routes);
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
