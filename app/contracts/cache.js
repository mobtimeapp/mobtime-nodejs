export class CacheInterface {
  async connect() {
    return this;
  }

  async disconnect() {}

  async get(_key) {
    throw new RuntimeException('CacheInterface must implement get');
  }

  async put(_key, _value, _ttl) {
    throw new RuntimeException('CacheInterface must implement put');
  }

  async has(_key) {
    throw new RuntimeException('CacheInterface must implement has');
  }
}
