import * as fs from 'node:fs/promises';
import { dirname, basename, join } from 'node:path';

import Command from 'contracts:command.js';

export default class Controller extends Command {
  constructor() {
    super([]);
  }

  validate(args) {
    return Boolean(args[0]);
  }

  async handle(_, args) {
    if (!this.validate(args)) {
      this.error('Missing arguments');
      return 1;
    }

    const namespace = dirname(args[0]);
    let controller = basename(args[0]);
    if (!controller.endsWith('.js')) {
      controller = controller + '.js';
    }

    const fullNamespace = `app/http/controllers/${namespace}`;

    const src = 'resources/templates/controller.js.template';
    const dest = join(fullNamespace, controller);

    try {
      await fs.mkdir(fullNamespace, { recursive: true });
    } catch (err) {
      this.error('Unable to make directory', fullNamespace);
      return 1;
    }
    try {
      await fs.copyFile(src, dest, fs.constants.COPYFILE_EXCL);
    } catch (err) {
      this.error(`${fullNamespace}/${controller} already exists`);
      return 1;
    }

    console.log('Created controller', dest);
    console.log('------------------------');
    console.log('To add your route:');
    console.log(' 1. Go to routes/api.js');
    console.log(` 2. Add Route.<method>('${namespace}', controller('${namespace}/${controller}'))`)
    console.log(' 3. ???');
    console.log(' 4. Profit');

    return 0;
  }
}

