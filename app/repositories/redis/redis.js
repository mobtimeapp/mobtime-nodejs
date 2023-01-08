import { app } from 'providers:appService.js';

import { createClient } from '@redis/client';

export const redis = (options) => {
  const client = createClient(options);

  client.on('error', async (err) => {
    app.make('log').error('Redis error:', err.toString());
  });

  return client;
};
