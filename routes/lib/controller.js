import { load } from './shared.js';

export const controller = load('controllers', async (classObject, request) => {
  console.log('route/lib/controller.controller', classObject);
  const instance = new classObject();
  console.log(instance);
  return await instance.invoke(request);
});

export const middleware = load('http:middleware/', async (classObject, request) => {
  return await (new classObject()).handle(request);
});
