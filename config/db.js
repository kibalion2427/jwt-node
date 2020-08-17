/*
 * Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
 * @author Shashank Tiwari
 */

"use strict";
/*requiring mongodb node modules */
const mongodb = require("mongodb");
const assert = require("assert");

class Db {
  constructor() {
    this.mongoClient = mongodb.MongoClient;
    this.ObjectID = mongodb.ObjectID;
  }

  onConnect() {
    const mongoURL = process.env.MONGO_DB_URL;
    return new Promise((resolve, reject) => {
      this.mongoClient.connect(
        mongoURL,
        { useUnifiedTopology: true },
        (err, client) => {
          if (err) {
            console.log("MONGODB Connection FAILED");
            reject(err);
          } else {
            console.log(" MONGODB Connection SUCCESS");
            assert.equal(null, err);
            resolve([client.db("local"), client, this.ObjectID]);
          }
        }
      );
    });
  }
}
module.exports = new Db();
