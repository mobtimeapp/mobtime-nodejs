const valueOr = (value, fallback) => {
  return value === undefined
    ? fallback
    : value;
};

export default class Request {
  #request = null;

  constructor(request) {
    this.#request = request;
  }

  all() {
    return {
      ...(this.#request.query || {}),
      ...(this.#request.body ? JSON.parse(this.#request.body) : {})
    };
  }

  input(key, fallback) {
    return valueOr(this.all()[key], fallback);
  }
  
  get(key, fallback) {
    return valueOr(this.#request.query[key], fallback);
  }

  post(key, fallback) {
    return valueOr(this.#request.body[key], fallback);
  }

  header(key, fallback) {
    return [].concat(valueOr(this.#request.getHeader(key), fallback));
  }

  hasHeader(key, value) {
    if (!this.#request.hasHeader(key)) {
      return false;
    }

    if (value === undefined) {
      return true;
    }

    const values = this.header(key);
    return values.includes(value);
  }

  accepts(type) {
    return this.hasHeader('accept', type);
  }
}
