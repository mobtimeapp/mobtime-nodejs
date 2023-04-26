import { app } from 'package:bootstrap/app.js';

export const socket = (controllerName) => (...args) => {
  const importPath = `websocket:controllers/${controllerName}`;
  return app.import(importPath)
    .then((imported) => {
      console.log('route/lib/websocket', importPath, imported);
      return imported;
    })
    .then(({ default: controllerClass }) => {
      return (new controllerClass()).handle(...args);
    })
    .catch((err) => {
      console.error('Unable to import websocket controller', controllerName, err);
    });
};
