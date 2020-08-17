"use strict";

const express = require("express");
const http = require("http");
const routes = require("./web/routes");
const appConfig = require("./config/app-config");

const handler = require("./handlers/api/authentication/authentication_handler");

// require socket libraries

class Server {
  constructor() {
    this.app = express();
    this.http = http.Server(this.app);
    //request http and pass it to socketIO
  }
  appConfig() {
    new appConfig(this.app).includeConfig();
  }

  includeRoutes() {
    new routes(this.app).routesConfig();
    //include socketRoutes
  }

  appExecute() {
    this.appConfig();
    this.includeRoutes();

    const PORT = process.env.PORT || 8001;
    const HOST = process.env.HOST || "localhost";

    this.http.listen(PORT, HOST, () => {
      console.log("handler", handler.refreshTokens);
      console.log(`Auhentication server running on http://${HOST}:${PORT}`);
    });
  }
}

const app = new Server();
app.appExecute();
