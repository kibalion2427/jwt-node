const {
  login,
  logout,
  register,
  usernameCheckAvailability,
  refreshToken,
} = require("./api/authentication/authentication_handler");

class RouteHandler {
  loginRouteHandler(request, response) {
    return login(request, response);
  }
  logoutRouteHandler(request, response) {
    return logout(request, response);
  }
  registerHandler(request, response) {
    return register(request, response);
  }
  usernameCheckAvailability(request, response) {
    return usernameCheckAvailability(request, response);
  }
  refreshTokenHandler(request, response) {
    return refreshToken(request, response);
  }
}

module.exports = new RouteHandler();
