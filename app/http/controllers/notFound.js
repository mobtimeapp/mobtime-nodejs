import Controller from 'controllers:controller.js';
import { Json } from '../response/Json.js';

export default class extends Controller {
  invoke(request) {
    return new Json(
      `404 - ${request.method} ${request.url} not found`,
      Json.STATUS_NOT_FOUND,
    );
  }
}
