"use strict";
const routerHandler = require("../handlers/router_handler");

class Routes {
  constructor(app) {
    this.app = app;
  }

  appRoutes() {
    this.app.post("/login", routerHandler.loginRouteHandler);
    this.app.delete("/logout", routerHandler.logoutRouteHandler);
    this.app.post("/refresh_token", routerHandler.refreshTokenHandler);
    this.app.post("/register", routerHandler.registerHandler);
    this.app.post(
      "/usernameAvailable",
      routerHandler.usernameCheckAvailability
    );
    this.app.post("/userSessionCheck",routerHandler.userSessionCheck)
  }

  routesConfig() {
    this.appRoutes();
  }
}

module.exports = Routes;
