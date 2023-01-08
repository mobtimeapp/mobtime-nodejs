import fs from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';

import { LogInterface } from 'interfaces:log.js';

export class FileLog extends LogInterface {
  constructor() {
    super();
  }

  log(...args) {
    return this.write('log', args);
  }

  info(...args) {
    return this.write('info', args);
  }

  error(...args) {
    return this.write('error', args);
  }

  write(type, data) {
    return fs.appendFile(
      this.#getPath(),
      super.write(type, data) + "\n"
    );
  }

  #getPath() {
    const today = (new Date()).toISOString().split('T')[0];
    return path.resolve(process.cwd(), 'storage', 'logs', `expravel-${today}.log`);
  }
};
