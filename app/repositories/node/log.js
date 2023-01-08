import { LogInterface } from 'interfaces:log.js';

export class ConsoleLog extends LogInterface {
  log(...args) {
    console.log(this.write('log', args));
  }

  info(...args) {
    console.warn(this.write('info', args));
  }

  error(...args) {
    console.error(this.write('error', args));
  }
};
