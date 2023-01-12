import UrlPattern from 'url-pattern';

import { join } from 'node:path';

import { app } from 'package:bootstrap/app.js';

export const load = (namespace) => (src) => {
  return () => {
    return app.import(`${namespace}:${src}`)
      .then((moduleDefinition) => {
        return moduleDefinition.default;
      })
      .catch((err) => {
        console.error('Unable to import', namespace, src, err);
      });
  };
};

const joinPath = (a, b) => {
  const joined = join(a, b);
  return (joined.length > 1)
    ? joined.replace(/\/$/, '')
    : joined;
}

export class Routable {
  #path = null;
  #pattern = null;
  #name = null;
  #middleware = [];
  #parent = null;

  constructor(path) {
    this.#path = path;
    this.#pattern = new UrlPattern(this.getPath());
  }

  getPath() { return this.#parent ? joinPath(this.#parent.getPath(), this.#path) : this.#path; }
  getName() { return this.#parent ? [this.#parent.name, this.#name].join('') : this.#name; }
  getMiddleware() { return (this.#parent ? this.#parent.middleware : []).concat(this.#middleware); }

  match(path) {
    return this.#pattern.match(path);
  }

  parent(parent) {
    this.#parent = parent;
    this.#pattern = new UrlPattern(this.getPath());
    return this;
  }

  name(name) {
    this.#name = name;
    return this;
  }

  middleware(middleware) {
    this.#middleware = this.#middleware.concat(middleware);
    return this;
  }

  toJson() {
    return {
      name: this.getNname,
      path: this.getPath,
    }
  }
}

const defaultHandler = (_request, response) => {
  return response.setStatus(501).send('501 Not implemented').end();
};

export class Route extends Routable {
  #method = null;
  #handler = defaultHandler;
  #description = null;
  #statusCodes = {};

  constructor(endpoint) {
    const [method, path] = endpoint.split(' ');
    super(path);

    this.#method = method.toLowerCase();
  }

  getMethod() { return this.#method; }
  async getHandler() { return this.#handler; }

  handler(handler) {
    this.#handler = handler;
    return this;
  }

  description(description) {
    this.#description = description;
    return this;
  }

  statusCodes(statusCodes) {
    this.#statusCodes = { ...this.#statusCodes, ...statusCodes };
    return this;
  }

  toJson() {
    return {
      ...super.toJson(),
      method: this.#method,
      description: this.#description,
      statusCodes: this.#statusCodes,
    };
  }
};

export class Group extends Routable {
  #children = [];

  constructor(basePath = '/') {
    super(basePath);
  }

  match(_path) {
    return null;
  }

  children(routes) {
    for (const route of routes) {
      this.#children.push(route.parent(this));
    }

    return this;
  }

  getChildren() {
    return this.#children;
  }

  toJson() {
    return {
      ...super.toJson(),
      children: this.#children.map(c => c.toJson()),
    };
  }
}

Route.get = (path, handler = null) => new Route(`GET ${path}`).handler(handler);
Route.post = (path, handler = null) => new Route(`POST ${path}`).handler(handler);
Route.delete = (path, handler = null) => new Route(`DELETE ${path}`).handler(handler);
Route.group = (options, children = []) => {
  const g = new Group(options.prefix);
  if ('as' in options) { g.name(options.as); }
  if ('middleware' in options) { g.middleware(options.middleware); }
  g.children(children);
  return g;
};
