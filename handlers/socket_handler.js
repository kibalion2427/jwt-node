const { addSocketId } = require("./database/user_db_handler");


class SocketHandler {
  addSocketId({ userId, socketId }) {
    return addSocketId({ userId, socketId });
  }
}

module.exports = new SocketHandler();
