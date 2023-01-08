import { env } from './env.js';

export const driver = env('LOG_DRIVER', 'console');
