const UNSET = Symbol('UNSET');

export default class Singleton {
  #src = null;
  #app = null;
  #bound = UNSET;

  constructor(src, app) {
    this.#src = src;
    this.#app = app;
  }

  async resolve(...args) {
    if (this.#bound !== UNSET) {
      return this.#bound;
    }
    const singletonClass = await this.#app.import(this.#src, 'default');
    this.#bound = new singletonClass(this.#app, ...args);
    return this.resolve();
  }
}
