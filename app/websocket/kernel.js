import { WebSocketServer } from 'ws';
import UrlPattern from 'url-pattern';

import { Group } from 'routes:lib/shared.js';

export default class Kernel {
  #app = null;
  #wss = null;
  #routes = [];

  //#middleware = [];

  constructor(app) {
    this.#app = app;

    this.#wss = new WebSocketServer({
      noServer: true,
      verifyClient: this.verifyClient.bind(this),
    });
  }

  async bind(http) {
    http.on('upgrade', this.handle.bind(this));
  }

  bindRoutes(routes) {
    this.#routes = routes;
  }

  #routeByName(name, params, query, collection) {
    for (const route of ([].concat(collection))) {
      if (route instanceof Group) {
        const result = this.#routeByName(name, params, query, route.getChildren());
        if (result) return result;
        continue;
      }

      if (route.getName() === name) {
        return route.toUrl(params, query);
      }
    }
    return null;
  }

  routeByName(name, params, query) {
    return this.#routeByName(name, params, query, this.#routes);
  }

  #route(path, collection) {
    for (const route of ([].concat(collection))) {
      if (route instanceof Group) {
        const result = this.#route(path, route.getChildren());
        if (result) return result;
        continue;
      }

      const matches = route.match(path);
      if (!matches) continue;

      return { route, matches };
    }
    return null;
  }

  async handle(request, tcpSocket, head) {
    this.#wss.handleUpgrade(request, tcpSocket, head, async (websocket) => {
      console.log('new websocket connection', request.url);
      const result = this.#route(request.url, this.#routes);
      
      if (!result) {
        websocket.close();
        return;
      }

      const { route, matches } = result;

      // const ws = this.runMiddleware(this.#middleware, websocket);

      //this.#wss.emit('connection', websocket);
      const handler = await route.getHandler();
      await handler(websocket, matches);
    });
  }

  // callback(bool result, int httpStatusCodeOnFailure, httpReasonPhraseOnFailure, headersOnFailure = {})
  async verifyClient({ _origin, _req, _secure }, callback) {
    callback(true);
  }
}

