import * as cacheConfig from 'config:cache.js';

import { RedisCache } from 'repositories:redis/cache.js';
import { NodeCache } from 'repositories:node/cache.js';

const drivers = {
  redis: RedisCache,
  memory: NodeCache,

  default: NodeCache,
};

export const CacheFactory = () => {
  const cacheClass = drivers[cacheConfig.driver] || drivers.default;
  return (new cacheClass()).connect();
};

