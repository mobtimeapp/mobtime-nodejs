import PrismaCommand from './prisma.js';

export default class Status extends PrismaCommand {
  getCommand() {
    return 'migrate status';
  }

  getArguments(_args) {
    return '';
  }
}
