import { Response } from './Response.js';

export class Json extends Response {
  handle(request, response) {
    // if (!request.accepts('application/json')) {
    //   throw new TypeError('This request does not accept application/json');
    // }
    const body = JSON.stringify(this.data);

    response.writeHead(this.status, {
      'content-length': body.length,
      'content-type': 'application/json',
    })
      .end(body);
  }
}
