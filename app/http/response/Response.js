export class Response {
  constructor(data = null, status = Response.STATUS_OK) {
    this.data = data;
    this.status = status;
  }

  handle(_response) {
    throw new RuntimeException('Response must implement handle');
  }
};

Response.STATUS_OK = 200;
Response.STATUS_NO_CONTENT = 201;
Response.STATUS_CREATED = 203;
Response.STATUS_NOT_FOUND = 404;
Response.STATUS_SERVER_ERROR = 500;
