import { app } from 'package:bootstrap/app.js';

export default class Injectable {
  wrapWithDependencies(method, dependencies) {
    if (!dependencies || dependencies.length === 0) {
      return method;
    }

    return (...args) => {
      return dependencies
        .reduce(async (memo, dependency) => {
          const deps = await memo;
          try {
            const dep = await app.make(dependency);
            return deps.concat(dep);
          } catch (err) {
            console.log('Injectable.wrapWithDependencies', method, dependency, err);
            return deps.concat(null);
          }
        }, Promise.resolve([]))
          .then((deps) => method(...args, ...deps));
    };
  }
}
