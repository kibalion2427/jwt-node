"use strict";

const socketHandler = require("../handlers/socket_handler");
const CONSTANTS = require("../config/constants");
const dbHandler = require("../handlers/database/login_db_handler");

class Socket {
  constructor(socket) {
    this.io = socket;
  }
  socketEvents() {
    this.io.on("connection", (socket) => {
      console.log("register socket events",socket.id);
      //logout user
      socket.on("logout", async (data) => {
        console.log("logout user");
        const userId = data.userId;
        try {
          await dbHandler.logout(userId);
          this.io.to(socket.id).emit("logout-response", {
            error: false,
            message: CONSTANTS.USER_LOGGED_OUT,
            userId: userId,
          });
          // console.log("connected sockets", socket);
          // socket[socket.id].disconnect();

          // console.log("sockets after logout",socket.sockets)
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
      console.log("socket connection user", socket.request._query["userId"]);
      // console.log("socket online", socket);
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
