export default class Lazy {
  #boundFn = null;

  constructor(boundFn) {
    this.#boundFn = boundFn;
  }

  async resolve(...args) {
    return this.#boundFn(...args);
  }
}
