import { env } from './env.js';

export const schema = env('DATABASE_SCHEMA', 'database/schema.prisma');
export const url = env('DATABASE_URL');
