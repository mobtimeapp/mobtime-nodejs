import { app } from 'package:bootstrap/app.js';

app.boot()
  .then(() => app.make('http:kernel.js'))
  .then(kernel => kernel.serve())
  .catch((err) => {
    console.error('???', err);
  });
