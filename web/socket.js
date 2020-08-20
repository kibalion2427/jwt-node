"use strict";

const socketHandler = require("../handlers/socket_handler");
const CONSTANTS = require("../config/constants");
const { logout } = require("../handlers/database/login_db_handler");

class Socket {
  constructor(socket) {
    this.io = socket;
  }
  socketEvents() {
    this.io.on("connection", (socket) => {
      //logout user
      socket.on("logout", async (data) => {
        try {
          const userId = dta.userId;
          await logout(userId);
          this.io.to(socket.id).emit("logout-response", {
            error: false,
            message: CONSTANTS.USER_LOGGED_OUT,
            userId: userId,
          });
        } catch (error) {
          console.log(error);
          this.io.to(socket.id).emit("logout-response", {
            error: true,
            message: CONSTANTS.USER_LOGOUT_FAILED,
            userId: userId,
          });
        }
      });
    });
  }

  socketConfig() {
    this.io.use(async (socket, next) => {
      try {
        await socketHandler.addSocketId({
          userId: socket.request._query["userId"],
          socketId: socket.id,
        });
        next();
      } catch (error) {
        console.log(error);
      }
    });
    this.socketEvents();
  }
}

module.exports = Socket;