import Controller from './controller.js';
import { Json } from '../response/Json.js';

import { routes } from 'routes:api.js';

export default class extends Controller {
  invoke(_request) {
    return new Json({
      routes: {
        api: [].concat(routes).map(r => r.toJson())
      }
    }, Json.STATUS_OK);
  }
};