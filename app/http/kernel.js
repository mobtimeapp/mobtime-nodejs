import http from 'node:http';

import { WebSocketServer } from 'ws';
import UrlPattern from 'url-pattern';

import Request from 'http:requests/request.js';
import * as httpConfig from 'config:http.js';

export default class Kernel {
  #app = null;
  #http = null;
  #wss = null;
  #routeFinderFn = () => null;

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
  }

  async serve() {
    this.#http.listen(httpConfig.port, httpConfig.host, () => {
      console.log('Listening', `${httpConfig.url}`);
    });
  }

  setRouteFinderFn(routeFinderFn) {
    this.#routeFinderFn = routeFinderFn;
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
    try {
      const [path, _] = request.url.split('?');
      const result = this.#routeFinderFn(path);
      if (!result) {
      return response
        .writeHead(404)
        .end('404 Not Found');
      }

      const { route, matches } = result;

      const req = await this.runMiddleware(this.#httpMiddleware, new Request(request, matches))
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
