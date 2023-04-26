import http from 'node:http';

import { WebSocketServer } from 'ws';
import UrlPattern from 'url-pattern';

import { Group } from 'routes:lib/shared.js';

import Request from 'http:requests/request.js';
import * as httpConfig from 'config:http.js';

export default class Kernel {
  #app = null;
  #http = null;
  #routes = [];

  #middleware = [
    'http:middleware/logRequests.js',
    'http:middleware/bodyParser.js',
  ];

  constructor(app) {
    this.#app = app;

    this.#http = http.createServer();

  }

  async serve() {
    this.#http.on('request', this.handle.bind(this));

    const websocketKernel = await this.#app.make('websocket:kernel.js');
    websocketKernel.bind(this.#http);

    this.#http.listen(httpConfig.port, httpConfig.host, () => {
      console.log('Listening', `${httpConfig.url}`);
    });
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
    console.log('http.#route', path, { collection });
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

  async handle(request, response) {
    try {
      const [path, _] = request.url.split('?');
      const result = this.#route(path, this.#routes);
      if (!result) {
      return response
        .writeHead(404)
        .end('404 Not Found');
      }

      const { route, matches } = result;

      const req = await this.runMiddleware(this.#middleware, new Request(request, matches))
      const handler = await route.getHandler();
      const responder = await handler(req);
      return responder.handle(request, response);
    } catch (err) {
      console.log('Unable to run controller', err);
      return response
        .writeHead(500)
        .end('500 Internal Error');
    }
  }

  async runMiddleware(middleware, value) {
    if (middleware.length === 0) return value;

    const [current, ...remaining] = middleware;
    const middlewareClass = await this.#app.import(current, 'default');
    const instance = new middlewareClass();
    return instance.handle(
      value,
      (nextValue) => this.runMiddleware(remaining, nextValue),
    );
  }
}
