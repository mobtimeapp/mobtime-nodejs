class Broadcaster {
  #handlers = {};

  publish(topic, payload) {
    this.#ensureTopicAvailable(topic);

    for(const handler of this.#handlers[topic]) {
      handler(payload);
    }
  }

  subscribe(topic, callback) {
    this.#ensureTopicAvailable(topic);

    this.#handlers[topic].add(callback);

    return () => this.#handlers[topic].delete(callback);
  }

  #ensureTopicAvailable(topic) {
    if (!(topic in this.#handlers)) {
      this.#handlers[topic] = new Set();
    }
  }
};

export const singleton = new Broadcaster();
