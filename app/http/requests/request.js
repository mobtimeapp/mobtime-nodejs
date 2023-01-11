import { URL } from 'node:url';
import { parse } from 'node:querystring';

import * as httpConfig from 'config:http.js';

const valueOr = (value, fallback) => {
  return value === undefined
    ? fallback
    : value;
};

export default class Request {
  #request = null;
  #params = {};
  #url = null;
  #bodyPromise = null;
  #body = null;

  constructor(request, params = {}) {
    this.#request = request;
    this.#params = params || {};
    this.#url = new URL(request.url, httpConfig.url);
  }

  readPostBody() {
    if (this.method === 'get') {
      return Promise.resolve();
    }

    this.#bodyPromise = new Promise((resolve, reject) => {
      let completed = false;
      let buffer = '';
      this.#request.on('data', function (data) {
        if (completed) return;

        buffer += data;

        if (body.length >= httpConfig.maxPostBytes) {
          completed = true;
          this.#request.connection.destroy();
          reject(new RangeError('Post body too large'));
          return;
        }
      });

      this.#request.on('end', function () {
        if (completed) return;
        this.#body = buffer;
        resolve(this.#body);
      });

    });

    return this.#bodyPromise;
  }

  get path() {
    return this.#url.pathname;
  }

  get url() {
    return this.#request.url;
  }

  get method() {
    return this.#request.method.toLowerCase();
  }

  get query() {
    return [
      ...this.#url.searchParams.entries()
    ]
      .reduce(
        (q, [k, v]) => ({ ...q, [k]: v }),
        {},
      );
  }

  get body() {
    return this.#body;
  }

  json() {
    return this.hasHeader('content-type', 'application/json')
      ? JSON.parse(this.#body)
      : null;
  }

  formData() {
    return this.#body
      ? parse(this.#body)
      : null;
  }

  all() {
    return {
      ...(this.query || {}),
      ...(this.json() || {}),
      ...(this.formData() || {}),
    };
  }

  params(key, fallback) {
    return valueOr(this.#params[key], fallback);
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
    return []
      .concat(
        valueOr(this.#request.headers[key], fallback)
      );
  }

  hasHeader(key, value) {
    console.log('Request.hasHeader', this.#request);
    if (!(key in this.#request.headers)) {
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
