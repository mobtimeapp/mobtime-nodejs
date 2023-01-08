import Matcher from 'url-pattern';

import { load } from './shared.js';

export const route = (path, handler) => {
  const pattern = new Matcher(path);
  return (request, socket) => {
    const parsedParams = pattern.match(request.url);
    if (!parsedParams) {
      return null;
    }

    const params = { ...(request.params || {}), ...parsedParams };

    return handler(socket, params);
  };
};

export const socket = load('websockets', async (classDefinition, [websocket, params]) => {
  return (await new classDefinition()).handle(websocket, params);
});
