import { app } from 'package:bootstrap/app.js';

export default class Binding {
  #original = null;
  #dependencies = Promise.resolve([]);
  #bound = null;

  constructor(object, methodName, dependencies) {
    this.#original = object[methodName].bind(object);
    this.#dependencies = this.#importMany(dependencies || []);

    this.#bound = this.#bind();
    object[methodName] = this.exec.bind(this);
  }

  #bind() {
    return async (...args) => {
      const instances = await this.#dependencies;
      return this.#original(...args, ...instances);
    }
  }

  exec(...args) {
    return this.#bound(...args);
  }

  async #importMany(dependencies, all = []) {
    if (dependencies.length === 0) {
      return all;
    }

    const [dependency, ...remaining] = dependencies;
    try {
      const instance = await app.make(dependency);
      return this.#importMany(remaining, all.concat(instance))
    } catch (err) {
      console.error('Binding.import', dependency, err);
      return this.#importMany(remaining, all.concat(null));
    }
  }
}

Binding.many = (object, methodMap) => {
  return Object.keys(methodMap).map((methodName) => (
    new Binding(object, methodName, methodMap[methodName])
  ));
};
