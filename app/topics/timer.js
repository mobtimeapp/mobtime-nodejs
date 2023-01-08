import { app } from 'providers:appService.js';

export class Timer {
  #topic = null;

  constructor(timerId) {
    this.#topic = `timer/${timerId}`;
  }

  subscribe(callback) {
    return app.withDependencies(['publisher:local'], (publisher) => {
      return publisher.subscribe(this.#topic, callback);
    });
  }
}
