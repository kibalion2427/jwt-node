const CONSTANTS = require("../../config/constants");
const {
  userNotFound,
  passwordNotFound,
  tokenNotFound,
} = require("../api/responses/ResponseError");
class UserValidator {
  constructor() {}

  getLoginData = (request, response) => {
    if (!request.body.username) return userNotFound(response);
    if (!request.body.password) return passwordNotFound(response);
    const data = {
      username: request.body.username.toLowerCase(),
      password: request.body.password,
    };
    return data;
  };

  getUserData = (request, response) => {
    if (!request.body.username) return userNotFound(response);
    return request.body.username;
  };

  getLogoutData = (request, response) => {
    if (!request.body.userId) return userNotFound(response);
    if (!request.body.token) return tokenNotFound(response);
    const data = {
      userId: request.body.userId,
      token: request.body.token,
    };
    return data;
  };
}

module.exports = new UserValidator();
