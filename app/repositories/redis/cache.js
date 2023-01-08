import { redis } from './redis.js';
import { CacheInterface } from 'interfaces:cache.js';

import * as cacheConfig from 'config:cache.js';

export class RedisCache extends CacheInterface {
  #client = null;

  constructor() {
    super();

    this.#client = redis(cacheConfig.redis);
  }

  async connect() {
    if (!this.#client.isReady) {
      await this.#client.connect();
    }

    return this;
  }

  async disconnect() {
    if (!this.#client || !this.#client.isReady) {
      return;
    }

    await this.#client.quit();

    this.#client = null;
  }

  get client() {
    return this.#client;
  }

  async has(key) {
    return this.#client.exists(key);
  }

  async get(key) {
    return this.#client.get(key);
  }

  async put(key, value, ttl = null) {
    const options = ttl === null
      ? {}
      : { EXAT: this.ttlToExAt(ttl) };

    return this.#client
      .set(key, value, options);
  }

  ttlToExAt(ttl) {
    if (ttl instanceof Date) {
      return parseInt(ttl.getTime() / 1000);
    } else if (typeof ttl === 'string') {
      return this.ttlToExAt(new Date(ttl));
    } else if (typeof ttl === 'number') {
      return parseInt((Date.now() / 1000) + ttl);
    }
  }
};
