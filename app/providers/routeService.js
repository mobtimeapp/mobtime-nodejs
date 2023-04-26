import { Service } from 'contracts:service.js';
import { routes as apiRoutes } from 'routes:api.js';
import { routes as wsRoutes } from 'routes:websockets.js';
import { Group } from 'routes:lib/shared.js';

export default class RouteService extends Service {
  async register() {
    await this.setupHttpRoutes();
    await this.setupWebsocketRoutes();
  }

  async setupHttpRoutes() {
    const kernel = await this.app.make('http:kernel.js');
    kernel.bindRoutes(apiRoutes);

    global.route = (name, params, query) => kernel.routeByName(name, params, query);
  }

  async setupWebsocketRoutes() {
    const kernel = await this.app.make('websocket:kernel.js');
    kernel.bindRoutes(wsRoutes);

    global.wsRoute = (name, params, query) => kernel.routeByName(name, params, query);
  }
};
