import { env } from './env.js';

export const driver = env('CACHE_DRIVER', 'redis');

export const redis = {
  username: env('REDIS_USER', null),
  password: env('REDIS_PASSWORD', null),
  url: env('REDIS_URL', 'redis://localhost:6379'),
  database: env('REDIS_DATABASE', 0),
};
