export default class Definition {
  #bound = null;

  constructor(bound) {
    this.#bound = bound;
  }

  async resolve() {
    return this.#bound;
  }
}
