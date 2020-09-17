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
      socket.on("logout", async (data) => {
        const userId = data.userId;
        try {
          await dbHandler.logout(userId);
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

      socket.on("typing", async (data) => {
        console.log("typing event",data);
        if (data.userId === "") {
          this.io.to(socket.id).emit("typing-response", {
            error: true,
            message: "Cannot emmit typing event",
          });
        } else if (data.isTyping === null || data.isTyping === undefined) {
          this.io.to(socket.id).emit("typing-response", {
            error: true,
            message: "Cannot emmit typing event",
          });
        } else {
          try {
            const userInfo = await socketHandler.getUserInfo({
              userId: "5f44774663e20927cb7246ad",//data.userId,
              socketId: false,
            });
            
            if (userInfo) {
              console.log("typing to",userInfo[0].socketId);
              this.io.to(userInfo[0].socketId).emit("typing-response", data);
            }
          } catch (error) {
            this.io.to(socket.id).emit(`typing-response`, {
              error: true,
              message: CONSTANTS.MESSAGE_STORE_ERROR,
            });
          }
        }
      });
      /**
       * send the messages to the user
       * receives a messagePacket(message,toUserId,fromUserId)
       * this function find the socketId of fromUserId paremeter and
       * emmit a new event add-message-response with the messagePacket as data
       */
      socket.on(`add-message`, async (data) => {
        if (data.message === "") {
          this.io.to(socket.id).emit(`add-message-response`, {
            error: true,
            message: CONSTANTS.MESSAGE_NOT_FOUND,
          });
        } else if (data.fromUserId === "") {
          this.io.to(socket.id).emit(`add-message-response`, {
            error: true,
            message: CONSTANTS.SERVER_ERROR_MESSAGE,
          });
        } else if (data.toUserId === "") {
          this.io.to(socket.id).emit(`add-message-response`, {
            error: true,
            message: CONSTANTS.SELECT_USER,
          });
        } else {
          try {
            const [toSocketId, messageResult] = await Promise.all([
              socketHandler.getUserInfo({
                userId: data.toUserId,
                socketId: true,
              }),
              socketHandler.insertMessages(data),
            ]);
            // debugger
            this.io.to(toSocketId).emit(`add-message-response`, data);
            // console.log("toSocketId",toSocketId,data)
          } catch (error) {
            this.io.to(socket.id).emit(`add-message-response`, {
              error: true,
              message: CONSTANTS.MESSAGE_STORE_ERROR,
            });
          }
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
