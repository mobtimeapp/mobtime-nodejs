import http from 'node:http';

import { WebSocketServer } from 'ws';
import UrlPattern from 'url-pattern';

import Request from 'http:requests/request.js';
import * as httpConfig from 'config:http.js';

class Kernel {
  #app = null;
  #http = null;
  #wss = null;

  routes = new Map();

  #httpMiddleware = [
    'http:middleware/logRequests.js',
    'http:middleware/bodyParser.js',
  ];
  #wssMiddleware = [];

  constructor(app) {
    this.#app = app;

    this.#http = http.createServer();
    this.#wss = new WebSocketServer({ noServer: true });

    this.#http.on('request', this.handle.bind(this));
    this.#http.on('upgrade', this.upgrade.bind(this));

    this.#http.listen(httpConfig.port, httpConfig.host, () => {
      console.log('Listening', `${httpConfig.url}`);
    });

  }

  map(path, route) {
    const trimmed = path === '/'
      ? path
      : path.replace(/\/+$/, '');
    this.routes.set(
      new UrlPattern(trimmed),
      route,
    );
  }

  async handle(request, response) {
    const [path, _] = request.url.split('?');
    const { route, matches } = this.getRouteAndMatches(path);

    const req = await this.runMiddleware(this.#httpMiddleware, new Request(request, matches))
    const handler = await route.getHandler();
    try {
      const responder = await handler(req);
      return responder.handle(request, response);
    } catch (err) {
      console.log('Unable to run controller', err);
      return response
        .writeHead(null, 500)
        .end();
    }
  }

  getRouteAndMatches(path) {
    for (const [pattern, route] of this.routes) {
      const matches = pattern.match(path);
      if (!matches) continue;

      return { route, matches };
    }
    return null;
  }

  async upgrade(request, tcpSocket, head) {
    const req = await this.runMiddleware(this.#wssMiddleware, request);
    this.#wss.handleUpgrade(req, tcpSocket, head, (websocket) => {
      this.#wss.emit('connection', websocket);
    });
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

export const singleton = (app) => new Kernel(app);
