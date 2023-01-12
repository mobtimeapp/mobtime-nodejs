export default class Alias {
  #boundSrc = null;
  #app = null;

  constructor(boundSrc, app) {
    this.#boundSrc = boundSrc;
    this.#app = app;
  }

  async resolve(...args) {
    return this.#app.import(this.#boundSrc, 'default')
      .then((boundClass) => new boundClass(...args))
      .catch((err) => {
        console.error('App.binding.alias error', this.#boundSrc, err);
      });
  }
}
