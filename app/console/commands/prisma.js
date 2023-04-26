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
    return args.filter(Boolean);
  }

  validate(_args) {
    return true;
  }

  async handle(_, args) {
    if (!this.validate(args)) {
      this.error('Missing arguments');
      return 1;
    }

    const cmd = 'node_modules/.bin/prisma';
    const prismaArgs = [
      ...([].concat(this.getCommand())),
      '--schema',
      databaseConfig.schema,
      ...([].concat(this.getArguments(args))),
    ];

    this.log([].concat(cmd).concat(prismaArgs).join(' '));

    const proc = childProcess.spawn(cmd, prismaArgs, {
      stdio: [process.stdin, process.stdout, process.stderr],
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
