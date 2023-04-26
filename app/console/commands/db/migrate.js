import PrismaCommand from '../prisma.js';

export default class Migrate extends PrismaCommand {
  getCommand() {
    return ['migrate', 'dev'];
  }

  getArguments(_args) {
    return '';
  }
}
