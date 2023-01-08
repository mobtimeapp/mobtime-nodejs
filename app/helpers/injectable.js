import { app } from 'package:bootstrap/app.js';

export default class Injectable {
  wrapWithDependencies(method, ...dependencies) {
    if (dependencies.length === 0) {
      return method;
    }

    return (...args) => dependencies
      .reduce(async (memo, dependency) => {
        const deps = await memo;
        try {
          const dep = await app.make(dependency);
          return Promise.resolve(deps.concat(dep));
        } catch (err) {
          return Promise.resolve(deps.concat(null));
        }
      }, Promise.resolve([]))
        .then((deps) => method(...args, ...deps));
  }
}
