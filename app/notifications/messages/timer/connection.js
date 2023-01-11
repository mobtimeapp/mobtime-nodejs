export default class Connection {
  constructor(timerId, socketId, type, name) {
    this.timerId = timerId;
    this.socketId = socketId;
    this.type = type;
    this.name = name;
  }

  toJson() {
    return JSON.parse(JSON.stringify(this));
  }
};
