import { env } from './env.js';

export const name = env('APP_NAME', 'My Application');
export const environment = env('APP_ENV', 'local');

export const services = [
  'route',
  'binding',
];
