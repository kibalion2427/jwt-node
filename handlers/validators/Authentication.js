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
    // console.log("data",data)
    return data;
  };
  getRegisterData = (request, response) => {
    if (!request.body.username) return userNotFound(response);
    if (!request.body.password) return passwordNotFound(response);

    const data = {
      username: request.body.username.toLowerCase(),
      password: request.body.password,
      isAdmin: request.body.isAdmin ? true : false,
    };
    return data;
  };

  getUserData = (request, response) => {
    if (!request.body.username && !request.body.userId)
      return userNotFound(response);
    if (request.body.username || request.body.userId) {
      return {userId:request.body.userId,username:request.body.username};
    }
  };

  getLogoutData = (request, response) => {
    if (!request.body.userId) return userNotFound(response);
    // if (!request.body.token) return tokenNotFound(response);
    const data = {
      userId: request.body.userId,
      // token: request.body.token,
    };
    return data;
  };
  getSessionData = (request, response) => {
    if (!request.body.userId) return userNotFound(response);
    const data = {
      userId: request.body.userId,
    };
    return data;
  };
}

module.exports = new UserValidator();
