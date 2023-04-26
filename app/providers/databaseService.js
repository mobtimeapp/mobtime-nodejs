import { Service } from 'contracts:service.js';

import { PrismaClient } from '@prisma/client'


export default class DatabaseService extends Service {
  async boot() {
  }

  async register() {
    this.app.singleton('@prisma/client', new PrismaClient());
  }
};

