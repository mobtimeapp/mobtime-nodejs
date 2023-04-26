import path from 'path';
import process from 'process';

const BASE_PATH = path.resolve(process.cwd());
const paths = {
  package: `file://${BASE_PATH}`,
  app: `file://${BASE_PATH}/app`,

  http: `file://${BASE_PATH}/app/http`,
  console: `file://${BASE_PATH}/app/console`,

  channels: `file://${BASE_PATH}/app/channels`,
  commands: `file://${BASE_PATH}/app/console/commands`,
  contracts: `file://${BASE_PATH}/app/contracts`,
  controllers: `file://${BASE_PATH}/app/http/controllers`,
  factories: `file://${BASE_PATH}/app/factories`,
  helpers: `file://${BASE_PATH}/app/helpers`,
  models: `file://${BASE_PATH}/app/models`,
  providers: `file://${BASE_PATH}/app/providers`,
  publishers: `file://${BASE_PATH}/app/publishers`,
  repositories: `file://${BASE_PATH}/app/repositories`,
  topics: `file://${BASE_PATH}/app/topics`,
  websocket: `file://${BASE_PATH}/app/websocket`,


  routes: `file://${BASE_PATH}/routes`,
  config: `file://${BASE_PATH}/config`,
};

export const resolve = (specifier, context, nextResolve) => {
  const [namespace, filePath] = specifier.split(':');
  if (namespace in paths) {
    return {
      url: new URL(path.join(paths[namespace], filePath)).href,
    };
  }
  return nextResolve(specifier, context);
};
