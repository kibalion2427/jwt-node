"use strict";

const Mongodb = require("../../config/db");

module.exports = function usernameCheck(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const [DB, CLIENT, ObjectID] = await Mongodb.onConnect();
      DB.collection("users")
        .find(data)
        .count((error, result) => {
          CLIENT.close()
          error ? reject(error) : resolve(result);
        });
    } catch (error) {
      reject(error);
    }
  });
};
