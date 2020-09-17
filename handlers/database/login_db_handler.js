"use strict";

class LoginQueryHandler {
  constructor() {
    this.Mongodb = require("../../config/db");
  }

  getUser(userId = "", username = "") {
    console.log(userId, username);
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = await this.Mongodb.onConnect();
        let condition = "";
        if (userId && userId !== "") {
          condition = { _id: ObjectID(userId) };
        }
        if (username && username !== "") {
          condition = { username: username };
        }
        console.log("condition",condition);

        DB.collection("users")
          .find(condition)
          .toArray((error, result) => {
            CLIENT.close();
            if (error) {
              reject(error);
            }
            console.log(result[0]);
            resolve(result[0]);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  makeUserOnline(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = await this.Mongodb.onConnect();
        DB.collection("users").findAndModify(
          { _id: ObjectID(userId) },
          [],
          { $set: { online: "Y" } },
          { new: true, upsert: true },
          (error, result) => {
            // console.log("makeuseronline",result)
            CLIENT.close();
            error ? reject(error) : resolve(result.value);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  logout(userID, isSocketId) {
    const data = {
      $set: {
        online: "N",
        socketId: "",
      },
    };
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = await this.Mongodb.onConnect();
        let condition = {};
        isSocketId
          ? (condition.isSocketId = userID)
          : (condition._id = ObjectID(userID));

        DB.collection("users").update(condition, data, (error, result) => {
          CLIENT.close();
          error ? reject(error) : resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new LoginQueryHandler();
