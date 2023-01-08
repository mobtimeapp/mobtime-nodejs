import * as logConfig from 'config:log.js';

import { FileLog } from 'repositories:fs/log.js';
import { ConsoleLog } from 'repositories:node/log.js';

const drivers = {
  file: FileLog,
  console: ConsoleLog,

  default: ConsoleLog,
};

export const LogFactory = () => {
  const logClass = drivers[logConfig.driver] || drivers.default;
  return new logClass();
};
