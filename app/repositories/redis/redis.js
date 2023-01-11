import { app } from 'package:bootstrap/app.js';

import { createClient } from '@redis/client';

export const redis = (options) => {
  const client = createClient(options);

  client.on('error', (err) => {
    app.make('log').error('Redis error:', err.toString());
  });

  return client;
};
