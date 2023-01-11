import path from 'path';
import process from 'process';

const BASE_PATH = path.resolve(process.cwd());
const paths = {
  package: `file://${BASE_PATH}`,
  app: `file://${BASE_PATH}/app`,

  http: `file://${BASE_PATH}/app/http`,
  console: `file://${BASE_PATH}/app/console`,

  controllers: `file://${BASE_PATH}/app/http/controllers`,
  websockets: `file://${BASE_PATH}/app/http/websockets`,
  providers: `file://${BASE_PATH}/app/providers`,
  repositories: `file://${BASE_PATH}/app/repositories`,
  factories: `file://${BASE_PATH}/app/factories`,
  interfaces: `file://${BASE_PATH}/app/interfaces`,
  publishers: `file://${BASE_PATH}/app/publishers`,
  helpers: `file://${BASE_PATH}/app/helpers`,
  channels: `file://${BASE_PATH}/app/channels`,
  topics: `file://${BASE_PATH}/app/topics`,
  commands: `file://${BASE_PATH}/app/console/commands`,


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
