import { app } from 'package:bootstrap/app.js';
import Injectable from 'helpers:injectable.js';

import * as appConfig from 'config:app.js';

import * as childProcess from 'node:child_process';

import { green, blue, whiteBright } from 'colorette';

export default class Command extends Injectable {
  constructor(dependencies) {
    super(app);

    this.handle = this.wrapWithDependencies(this.handle.bind(this), dependencies);
  }

  async invoke(commandName, args) {
    console.log();
    console.log(whiteBright('┌─┤ 🪚'), blue(`carpenter ${commandName}`));
    console.log(whiteBright('┴'));
    const startedAt = Date.now();
    try {
      const result = await this.handle(commandName, args);

      const duration = Date.now() - startedAt;
      console.log(whiteBright('┬'));
      console.log(whiteBright(`└─┤⌛ Took ${duration / 1000}s`));

      return result;

    } catch (err) {
      this.error(err.toString());

      const duration = Date.now() - startedAt;
      console.log(whiteBright('┬'));
      console.log(whiteBright(`└─┤⌛ Took ${duration / 1000}s`));

      return -1;
    }
  }

  async handle() {
    throw new RuntimeException('Command does not implement handle');
  }

  log(...args) {
    console.log(...this.#preamble('LOG'), ...args);
  }

  error(...args) {
    console.error(...this.#preamble('ERR'), ...args);
  }

  #preamble(type) {
    const dateTime = (new Date()).toISOString().slice(0, -5).replace(/T/, ' ');
    return [
      `[${green(dateTime)}]`,
      whiteBright(`${appConfig.environment}.${type}`),
    ];
  }

  async carpenter(command, args, options, callback) {
    const proc = Command.run(command, args);

    return new Promise((resolve, reject) => {
      proc.on('exit', (code) => {
        if (code === 0) {
          return resolve();
        }
        return reject(code);
      });

      proc.on('error', (error) => {
        reject(error);
      });

      callback(proc);
    });
  }
};

Command.run = (command, args, options) => {
  return childProcess.fork('./carpenter.js', [command, ...args], options);
};
