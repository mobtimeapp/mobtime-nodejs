import * as log from 'factories:log.js';
import * as cache from 'factories:cache.js';

import Definition from 'helpers:bindings/definition.js';
import Lazy from 'helpers:bindings/lazy.js';
import Singleton from 'helpers:bindings/singleton.js';

import * as appConfig from 'config:app.js';

class Application {
  #remappings = {};
  #bound = {};
  #registered = {};

  constructor() {
    this.alias = this.alias.bind(this);
    this.bind = this.bind.bind(this);
    this.import = this.import.bind(this);
    this.make = this.make.bind(this);
  }

  async register(src) {
    if (src in this.#registered) {
      return this.#registered[src];
    }

    const providerClass = await this.import(src, 'default');
    const provider = new providerClass(this);

    if ('register' in provider) await provider.register();
    if ('boot' in provider) await provider.boot();

    this.#registered[src] = provider;
  }

  async boot() {
    await Promise.all(
      appConfig.serviceProviders.map(src => this.register(src))
    );
  }

  alias(remapped, src) {
    this.#bound[src] = new Alias(remapped, src, this);
    return this;
  }

  async bind(src, what) {
    if (typeof what === 'function') {
      return this.#bindLazy(src, what);
    } else if (typeof what === 'string') {
      return this.#bindAlias(what, src);
    }

    return this.#bindInstance(src, what);
  }

  async #bindInstance(src, instance) {
    this.#bound[src] = new Definition(instance, this);
    return this;
  }

  async #bindAlias(srcInterface, srcImplementation) {
    return this.#bindInstance(srcInterface, this.import(srcImplementation, 'default'))
  }

  async #bindLazy(src, method) {
    this.#bound[src] = new Lazy(method, this)
    return this;
  }

  async singleton(src, implementation) {
    let imp = implementation || src;
    this.#bound[src] = new Singleton(imp, this);
    return this;
  }

  async import(src, exportKey) {
    return import(src)
      .then((exported) => {
        if (!exportKey) {
          return exported;
        }
        return exported[exportKey];
      })
      .catch((err) => {
        console.error('AppContainer', { src, exportKey }, err);
      });
  }

  make(src, ...args) {
    if (src in this.#bound) {
      return this.#bound[src].resolve(...args);
    }
    return this.import(src, 'default')
      .then((madeClass) => new madeClass(...args))
      .catch((err) => {
        console.error('Container.make', src, args, err);
      });
  }
}

export const app = new Application();

app.singleton('websocket:kernel.js');
app.singleton('http:kernel.js');
app.singleton('console:kernel.js');

app.bind('app', app);

app.bind('contracts:log.js', () => log.factory(app));
app.bind('contracts:cache.js', () => cache.factory(app));
