import { app } from 'package:bootstrap/app.js';

export const controller = (controllerName) => (...args) => {
  const importPath = `controllers:${controllerName}`;
  return app.import(importPath)
    .then((imported) => {
      console.log('route/lib/controller', importPath, imported);
      return imported;
    })
    .then(({ default: controllerClass }) => {
      return (new controllerClass()).invoke(...args);
    })
    .catch((err) => {
      console.error('Unable to import controller', controllerName, args, err);
    });
};
