import Job from 'contracts:job.js';

export default class KeepAlive extends Job {
  constructor() {
    super([
      '@prisma/client',
    ]);
  }

  async invoke(db) {
    this.disconnectStaleClients(db);
    this.pingBatchOfClients(db);
  }

  async disconnectStaleClients(db) {
    const connections = await db.connection.findMany({
      select: ['connectionId', 'connectedAt', 'disconnectedAt', 'pingedAt', 'timeoutAt'],
      where: {
        connectedAt: { not: null },
        disconnectedAt: { is: null },
        timeoutAt: { gte: Date.now() },
      },
    });

    console.log('to disconnect:', connections);
  }

  async pingBatchOfClients(db) {
    const connections = await db.connection.findMany({
      select: ['connectionId', 'connectedAt', 'disconnectedAt', 'pingedAt', 'timeoutAt'],
      where: {
        connectedAt: { not: null },
        disconnectedAt: { is: null },
        pingedAt: { is: null },
        timeoutAt: { lt: Date.now() },
      },
    });

    console.log('to ping:', connections);
  }
};
