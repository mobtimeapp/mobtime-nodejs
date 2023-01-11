import PrismaCommand from './prisma.js';

export default class Migrate extends PrismaCommand {
  getCommand() {
    return 'migrate dev';
  }

  getArguments(args) {
    return `--name ${args[0] || 'migration'}`;
  }
}
