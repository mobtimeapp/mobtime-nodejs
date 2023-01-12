import * as childProcess from 'node:child_process';

import Command from 'contracts:command.js';

import * as databaseConfig from 'config:database.js';

export default class PrismaCommand extends Command {
  constructor() {
    super([]);
  }

  getCommand() {
    return 'help';
  }

  getArguments(args) {
    return args.join(' ');
  }

  async handle(_, args) {
    const cmd = [
      'node_modules/.bin/prisma',
      this.getCommand(),
      `--schema ${databaseConfig.schema}`,
      this.getArguments(args),
    ].join(' ');

    this.log(cmd);

    const proc = childProcess.exec(cmd);

    proc.stdout.on('data', (buffer) => {
      if (buffer.trim()) { console.log(buffer); }
    });
    proc.stderr.on('data', (buffer) => {
      if (buffer.trim()) console.error(buffer);
    });


    return new Promise((resolve, reject) => {
      proc.on('exit', (code) => {
        if (code === 0) {
          return resolve();
        }
        return reject(code);
      });

      proc.on('error', (err) => {
        this.error(err.toString());
      });
    });
  }
}
