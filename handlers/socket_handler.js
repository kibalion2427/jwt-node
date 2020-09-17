const { addSocketId, getUserInfo } = require("./database/user_db_handler");
const { insertMessages } = require("./database/chat_db_handler");

class SocketHandler {
  addSocketId({ userId, socketId }) {
    return addSocketId({ userId, socketId });
  }
  getUserInfo({ userId, socketId }) {
    return getUserInfo({ userId, socketId });
  }
  insertMessages(messagePacket) {
    return insertMessages(messagePacket);
  }
}

module.exports = new SocketHandler();
