import { env } from './env.js';

export const port = env('APP_PORT', 8080);
export const host = env('APP_HOST', 'localhost');
export const url  = env('APP_URL', `http://${host}:${port}`);
