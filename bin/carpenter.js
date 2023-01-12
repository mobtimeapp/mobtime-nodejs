import process from 'node:process';

import { app } from 'package:bootstrap/app.js';

app.boot()
  .then(() => app.make('console:kernel.js'))
  .then(kernel => kernel.handle(process.argv[2], process.argv.slice(3)))
  .catch((err) => {
    console.error('???', err);
  });
