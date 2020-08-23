"use strict";

const Mongodb = require("../../config/db");

module.exports = {
  usernameCheck: function (data) {
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = await Mongodb.onConnect();
        DB.collection("users")
          .find(data)
          .count((error, result) => {
            CLIENT.close();
            error ? reject(error) : resolve(result);
          });
      } catch (error) {
        reject(error);
      }
    });
  },
  userSessionCheck: function (data) {
    console.log("CHECKING SESSION",data)
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = await Mongodb.onConnect();
        DB.collection("users").findOne(
          { _id: ObjectID(data.userId), online: "Y" },
          (error, result) => {
            CLIENT.close();
            error ? reject(error) : resolve(result);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  },
};
