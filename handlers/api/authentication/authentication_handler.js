"use strict";
require("dotenv").config();
var HashMap = require("hashmap");
const loginQueryHandler = require("../../database/login_db_handler");
const registerQueryHandler = require("../../database/register_db_handler");
const usernameCheck = require("../../database/check_db_user");
const passwordHash = require("../../../utils/password-hash");
const {
  userNotFound,
  invalidPassword,
  userLoginFailed,
  userDuplicatedResponse,
  userRegisterFailedResponse,
  checkUserAvailableResponse,
  usernameNotAvailableResponse,
  userLogoutFailed,
  tokenNotFound,
  refreshTokenFailed,
} = require("../responses/ResponseError");
const { createRefreshToken, verifyRefreshToken } = require("../helpers/Tokens");
const {
  userLoginOK,
  userRegisterOKResponse,
  userNameAvailableOKResponse,
  userLogoutOK,
  refreshTokenOKResponse,
} = require("../responses/ResponseOK");
const sendRefreshToken = require("../helpers/sendRefreshToken");
const {
  getLoginData,
  getUserData,
  getLogoutData,
} = require("../../validators/Authentication");

class AuthenticationHandler {
  constructor() {
    this.refreshTokens = new HashMap();
  }

  login = async (request, response) => {
    const data = getLoginData(request, response);

    try {
      const user = await loginQueryHandler.getUserByUsername(data.username);
      if (!user) return userNotFound(response);

      const validPassword = passwordHash.compareHash(
        data.password,
        user.password
      );
      if (!validPassword) return invalidPassword(response);

      await loginQueryHandler.makeUserOnline(user.id);
      sendRefreshToken(response, createRefreshToken(user.username));
      // this.pushRefreshTokensToUser(
      //   user.username,
      //   this.generateRefreshToken(user.username)
      // );
      return userLoginOK(response, user);
    } catch (error) {
      return userLoginFailed(response);
    }
  };

  logout = async (request, response) => {
    const data = getLogoutData(request, response);
    if (data.token !== this.refreshTokens.get(data.userId))
      return tokenNotFound(response);
    try {
      await loginQueryHandler.logout(data.userId);
      // this.refreshTokens = this.refreshTokens.filter(
      //   (token) => token != data.token
      // );
      sendRefreshToken(response, "");
      this.refreshTokens.delete(data.userId);
      return userLogoutOK(response);
    } catch (error) {
      return userLogoutFailed(response);
    }
  };

  refreshToken = async (request, response) => {
    const token = request.cookies.jid;
    if (!token) return response.send({ ok: false, accessToken: "" });
    let payload = null;
    try {
      payload = verifyRefreshToken(token); //return {username:"",}
    } catch (error) {
      return refreshTokenFailed(response);
    }
    sendRefreshToken(response, createRefreshToken(payload.username));
    return refreshTokenOKResponse(response, payload);
  };
  register = async (request, response) => {
    const data = getLoginData(request, response);
    try {
      data.online = "Y";
      data.socketID = "";
      data.password = passwordHash.createHash(data.password);
      const userExists = await loginQueryHandler.getUserByUsername(
        data.username
      );
      if (userExists) return userDuplicatedResponse(response);

      const registered = await registerQueryHandler.registerUser(data);
      if (!registered) return userRegisterFailedResponse(response);

      sendRefreshToken(response, createRefreshToken(data.username));
      // this.pushRefreshTokensToUser(data.username, createRefreshToken(data.username));
      return userRegisterOKResponse(response, data);
    } catch (error) {
      console.log(error);
      return userRegisterFailedResponse(response);
    }
  };

  usernameCheckAvailability = async (request, response) => {
    const username = getUserData(request, response);
    try {
      const count = await usernameCheck({ username: username.toLowerCase() });
      if (count > 0) return usernameNotAvailableResponse(response);
      return userNameAvailableOKResponse(response);
    } catch (error) {
      return checkUserAvailableResponse(response);
    }
  };

  pushRefreshTokensToUser = (userId, refreshToken) => {
    this.refreshTokens.set(userId, refreshToken);
    // console.log("OBJECTO", this.refreshTokens);
  };
}

module.exports = new AuthenticationHandler();
