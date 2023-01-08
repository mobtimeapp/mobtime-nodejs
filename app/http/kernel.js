import http from 'node:http';
import { WebSocketServer } from 'ws';
import UrlPattern from 'url-pattern';

import * as httpConfig from 'config:http.js';

class Kernel {
  #app = null;
  #http = null;
  #wss = null;

  routes = new Map();

  #httpMiddleware = [
    'http:middleware/transformRequest.js',
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
    console.log('http/kernel.map', trimmed, route);
    this.routes.set(
      new UrlPattern(trimmed),
      route,
    );
  }

  async handle(request, response) {
    const req = await this.runMiddleware(this.#httpMiddleware, request)
    const route = this.getRoute(request.url);
    const handler = await route.getHandler();
    const responder = await handler(req);
    return responder.handle(request, response);
  }

  getRoute(path) {
    for (const [pattern, route] of this.routes) {
      const match = pattern.match(path);
      if (!match) continue;
      console.log('getRoute', path, pattern, route.path);

      return route;
    }
    console.log('getRoute not found', path);
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
    const instance = new (await this.#app.import(current)).default();
    return instance.handle(
      value,
      (nextValue) => this.runMiddleware(remaining, nextValue),
    );
  }
}

export const singleton = (app) => new Kernel(app);
