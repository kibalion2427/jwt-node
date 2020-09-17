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
        const [DB, CLIENT, ObjectID] = await this.Mongodb.onConnect();
        DB.collection("users").update(
          { _id: ObjectID(data.id) },
          data.value,
          (error, result) => {
            CLIENT.close();
            error ? reject(error) : resolve(result);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  getUserInfo = ({ userId, socketId = false }) => {
    let queryProjection = null;
    if (socketId) {
      queryProjection = {
        socketId: true,
      };
    } else {
      queryProjection = {
        username: true,
        online: true,
        _id: false,
        socketId:true,
        id: "$_id", //to avoid showing db fields schema, return id instead _id
      };
    }
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = await this.Mongodb.onConnect();
        DB.collection("users")
          .aggregate([
            {
              $match: {
                _id: ObjectID(userId),
              },
            },
            { $project: queryProjection },
          ])
          .toArray((error, result) => {
            CLIENT.close();
            if (error) {
              reject(error);
            }
            socketId ? resolve(result[0]["socketId"]) : resolve(result);
          });
      } catch (error) {
        reject(error);
      }
    });
  };
}

module.exports = new UserQueryHandler();
