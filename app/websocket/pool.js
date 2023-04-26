export default class Pool {
  #map = {};

  constructor() {
  }

  activeConnections() {
    return Object.keys(this.#map).length;
  }

  track(connectionId, websocket) {
    console.log('websocket/pool', 'track', connectionId);
    this.#map[connectionId] = websocket;
    websocket.addEventListener('close', () => {
      console.log('websocket/pool', 'untrack', connectionId);
      delete this.#map[connectionId];
    });
  }

  get(connectionId) {
    return this.#map[connectionId];
  }

  has(connectionId) {
    return connectionId in this.#map;
  }
};
