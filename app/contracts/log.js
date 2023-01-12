import * as appConfig from 'config:app.js';

export class LogInterface {
  log() {
    throw new RuntimeException('LogInterface must implement log');
  }

  info() {
    throw new RuntimeException('LogInterface must implement info');
  }

  error() {
    throw new RuntimeException('LogInterface must implement error');
  }

  write(type, data) {
    return [this.#prefix(), this.#transformData(data)].join(' ');
  }

  #transformData(data) {
    return data
      .filter(Boolean)
      .map(d => (typeof d === 'string' ? d : JSON.stringify(d)))
      .join(' ');
  }

  #prefix() {
    const [day, time] = (new Date()).toISOString().split('T');
    const shortTime = time.split('.')[0];
    const date = [day, shortTime].join(' ');

    return `[${date}Z] ${appConfig.name}.${appConfig.environment}`;
  }
}
