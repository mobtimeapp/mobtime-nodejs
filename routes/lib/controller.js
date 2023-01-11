import { app } from 'package:bootstrap/app.js';

export const controller = (controllerName) => (...args) => {
  return app.import(`controllers:${controllerName}`)
    .then(({ default: controllerClass }) => {
      return (new controllerClass()).invoke(...args);
    })
    .catch((err) => {
      console.error('Unable to import controller', controllerName, args, err);
    });
};
