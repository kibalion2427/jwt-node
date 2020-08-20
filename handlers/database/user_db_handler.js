"use strict";

class UserQueryHandler {
  constructor() {
    this.Mongodb = require("../../config/db");
  }
  addSocketId = ({ userId, socketId }) => {
    const data = {
      id: userId,
      value: {
        $set: {
          socketId: socketId,
          online: "Y",
        },
      },
    };
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = this.Mongodb.onConnect();
        DB.collection("users").update(
          { _id: ObjectID(data.id) },
          data.value,
          (err, result) => {
            CLIENT.close();
            error ? reject(error) : resolve(result);
          }
        );
      } catch (error) {}
    });
  };
}

module.exports = new UserQueryHandler();
