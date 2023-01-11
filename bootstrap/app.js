import * as http from 'app:http/kernel.js'
import * as log from 'factories:log.js';
import * as cache from 'factories:cache.js';

class Application {
  #remappings = {};
  #singletons = {};

  constructor() {
    this.alias = this.alias.bind(this);
    this.bind = this.bind.bind(this);
    this.import = this.import.bind(this);
    this.make = this.make.bind(this);
  }

  alias(originalImport, transformedImport) {
    this.#remappings[originalImport] = transformedImport;
  }

  async bind(src, definition) {
    this.#singletons[src] = await definition();
    return this.#singletons[src];
  }

  async import(src, exportKey) {
    return import(this.#remappings[src] || src)
      .then((exported) => {
        if (!exportKey) {
          return exported;
        }
        return exported[exportKey];
      });
  }

  make(src, ...args) {
    if (typeof src === 'function' && src.toString().startsWith('class')) {
      return new src(...args);
    }

    return typeof this.#singletons[src] === 'function'
      ? this.#singletons[src](...args)
      : this.#singletons[src];
  }

  isBound(src) {
    return src in this.#singletons;
  }

  async #makeOrImport(src, ...args) {
    if (this.isBound(src)) {
      return this.make(src, ...args);
    }

    return this.import(src)
      .then((moduleDefinition) => {
        const exported = Object.keys(moduleDefinition);
        if (exported.length > 1) {
          return moduleDefinition[args[0]];
        }
        return moduleDefinition.default || moduleDefinition[exported[0]];
      })
      .then((exported) => {
        if (typeof exported === 'function' && exported.toString().startsWith('class ')) {
          return new exported();
        }
        return exported;
      })
      .catch((err) => {
        console.error('Unable to import', src, err);

        return undefined;
      });
  }

  async withDependencies(dependencies, callback) {
    return Promise.all(
      dependencies.map(d => {
        const args = [].concat(d);

        return this.#makeOrImport(...args).catch((err) => {
          console.error('Unable to dependency inject', d, err);
          return null;
        });
      })
    )
      .then(deps => callback(...deps));
  }
}

export const app = new Application();

app.bind('log', () => log.factory(app));
//app.bind('cache', () => cache.factory(app));
