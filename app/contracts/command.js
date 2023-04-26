import { app } from 'package:bootstrap/app.js';
import Injectable from 'helpers:injectable.js';

import * as appConfig from 'config:app.js';

import { green, blue, whiteBright, bgRedBright } from 'colorette';

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
    console.error(...args.map(text => bgRedBright(whiteBright(text))));
  }

  #preamble(type) {
    const dateTime = (new Date()).toISOString().slice(0, -5).replace(/T/, ' ');
    return [
      `[${green(dateTime)}]`,
      whiteBright(`${appConfig.environment}.${type}`),
    ];
  }

  carpenter(command, args) {
    return Command.run(command, args);
  }
};

Command.run = async (command, args) => {
  const kernel = await app.make('console:kernel.js');
  return kernel.handle(command, args);
};
