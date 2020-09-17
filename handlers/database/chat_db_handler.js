"use strict";

class ChatQueryHandler {
  constructor() {
    this.Mongodb = require("../../config/db");
  }
  insertMessages = (messagePacket) => {
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = await this.Mongodb.onConnect();
        DB.collection("messages").insertOne(messagePacket, (error, result) => {
          CLIENT.close();
          error ? reject(error) : resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  getMessages = ({ userId, toUserId }) => {
    console.log("credentials", userId, toUserId);
    const data = {
      $or: [
        {
          $and: [
            {
              toUserId: userId,
            },
            {
              fromUserId: toUserId,
            },
          ],
        },
        {
          $and: [
            {
              toUserId: toUserId,
            },
            {
              fromUserId: userId,
            },
          ],
        },
      ],
    };
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = await this.Mongodb.onConnect();
        DB.collection("messages")
          .find(data)
          .sort({ timestamp: 1 })
          .toArray((error, result) => {
            CLIENT.close();
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  getChatList = (userId ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = await this.Mongodb.onConnect();
        DB.collection("messages")
          .aggregate([
            {
              $match: {
                toUserId: { $eq: userId },
              },
            },
            {
              $group: {
                _id: "$fromUserId",
              },
            },
            {
              $project: {
                fromUserId: true,
              },
            },
          ])
          .toArray((error, result) => {
            CLIENT.close();
            error ? reject(error) : resolve(result);
          });
      } catch (error) {
        reject(error);
      }
    });
  };
}

module.exports = new ChatQueryHandler();
