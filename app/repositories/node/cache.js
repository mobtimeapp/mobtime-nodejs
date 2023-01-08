import { CacheInterface } from 'interfaces:cache.js';

const cache = {};

export class NodeCache extends CacheInterface {
  async get(key) {
    if (!(key in cache)) {
      return null;
    }

    const { value, ttl } = cache[key];
    if (ttl > 0 && Date.now() >= ttl) {
      delete cache[key];
      return undefined;
    }
    return value;
  }

  async put(key, value, ttl = null) {
    cache[key] = {
      value, 
      ttl: (ttl ? this.ttlToExAt(ttl) : null),
    };
  }

  ttlToExAt(ttl) {
    if (ttl instanceof Date) {
      return ttl.valueOf();
    } else if (typeof ttl === 'string') {
      return this.ttlToExAt(new Date(ttl));
    } else if (typeof ttl === 'number') {
      return (Date.now() / 1000) + ttl;
    }
  }
};

