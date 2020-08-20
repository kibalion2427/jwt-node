"use strict";

const express = require("express");
const http = require("http");
const socketio = require("socket.io")


const socketEvents = require("./web/socket")
const routes = require("./web/routes");
const appConfig = require("./config/app-config");


// const handler = require("./handlers/api/authentication/authentication_handler");



class Server {
  constructor() {
    this.app = express();
    this.http = http.Server(this.app);
    //request http and pass it to socketIO
    this.socket = socketio(this.http)
  }
  appConfig() {
    new appConfig(this.app).includeConfig();
  }

  includeRoutes() {
    new routes(this.app).routesConfig();
    //include socketRoutes
    new socketEvents(this.socket).socketConfig()
  }

  appExecute() {
    this.appConfig();
    this.includeRoutes();

    const PORT = process.env.PORT || 8001;
    const HOST = process.env.HOST || "localhost";

    this.http.listen(PORT, HOST, () => {
      // console.log("handler", handler.refreshTokens);
      console.log(`Auhentication server running on http://${HOST}:${PORT}`);
    });
  }
}

const app = new Server();
app.appExecute();
