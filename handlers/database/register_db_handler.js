"use strict";

class RegisterQueryHandler {
  constructor() {
    this.Mongodb = require("../../config/db");
  }

  registerUser(data) {
    // console.log("register data", data);
    return new Promise(async (resolve, reject) => {
      try {
        const [DB, CLIENT, ObjectID] = await this.Mongodb.onConnect();
        DB.collection("users").insertOne(data, (error, result) => {
          CLIENT.close();
          if (error) {
            // console.log("ERROR", error);
            reject(error);
          }else{
            // console.log("RESULT", result);
            resolve(result);
          }
          
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new RegisterQueryHandler();
