"use strict";

const { addSocketId } = require("../database/user_db_handler");

class UserSocketHandler {
  addSocketId = ({ userId, socketId }) => {
    return addSocketId({ userId, socketId });
  };
}

module.exports = new UserSocketHandler();
