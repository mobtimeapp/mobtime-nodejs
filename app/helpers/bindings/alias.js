export default class Alias {
  #remapped = null;
  #src = null;
  #app = null;

  constructor(remapped, src, app) {
    this.#remapped = remapped;
    this.#src = src;
    this.#app = app;
  }

  async resolve(...args) {
    return this.#app.make(this.#remapped, ...args)
      .catch((err) => {
        console.error('App.binding.alias error', { remapped: this.#remapped, src: this.#src }, err);
        return Promise.reject(err);
      });
  }
}
