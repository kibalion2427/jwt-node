"use strict";
//TODO Move getMessages method to another class handler
require("dotenv").config();
var HashMap = require("hashmap");
const loginQueryHandler = require("../../database/login_db_handler");
const registerQueryHandler = require("../../database/register_db_handler");
const {
  usernameCheck,
  userSessionCheck,
} = require("../../database/check_db_user");
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
  getRegisterData,
  getSessionData,
} = require("../../validators/Authentication");

const CONSTANTS = require("../../../config/constants");
const chat_db_handler = require("../../database/chat_db_handler");

class AuthenticationHandler {
  constructor() {
    this.refreshTokens = new HashMap();
  }

  login = async (request, response) => {
    const data = getLoginData(request, response);
    console.log("logync", data);

    try {
      const user = await loginQueryHandler.getUser("", data.username);

      if (!user) return userNotFound(response);

      const validPassword = passwordHash.compareHash(
        data.password,
        user.password
      );
      if (!validPassword) return invalidPassword(response);
      await loginQueryHandler.makeUserOnline(user._id);
      sendRefreshToken(response, createRefreshToken(user.username));
      // this.pushRefreshTokensToUser(
      //   user.username,
      //   this.generateRefreshToken(user.username)
      // );
      return userLoginOK(response, user);
    } catch (error) {
      console.log(error);
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
    const data = getRegisterData(request, response);
    try {
      data.online = "Y";
      data.socketId = "";
      data.password = passwordHash.createHash(data.password);
      const userExists = await loginQueryHandler.getUser("", data.username);
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
    const data = getUserData(request, response);
    console.log("username to check", data);
    try {
      const count = await usernameCheck({
        username: data.username.toLowerCase(),
      });
      if (count > 0) return usernameNotAvailableResponse(response);
      return userNameAvailableOKResponse(response);
    } catch (error) {
      return checkUserAvailableResponse(response);
    }
  };

  userSessionCheck = async (request, response) => {
    const { userId } = getSessionData(request, response);
    try {
      // console.log("session check handler", userId);
      const result = await userSessionCheck({ userId: userId });
      response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error: false,
        username: result.username,
        message: CONSTANTS.USER_LOGIN_OK,
      });
    } catch (error) {
      response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.USER_NOT_LOGGED_IN,
      });
    }
  };

  getUser = async (request, response) => {
    const userData = getUserData(request, response);
    // console.log("data",userData);
    try {
      const user = await loginQueryHandler.getUser(
        userData.userId,
        userData.username
      );
      if (!user) return userNotFound(response);
      response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error: false,
        user: {
          userId: user._id,
          username: user.username,
          isAdmin: user.isAdmin,
          online: user.online,
          socketId: user.socketId,
        },

        message: "User found success",
      });
    } catch (error) {
      response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error: true,
        username: userData.username,
        message: CONSTANTS.USER_NOT_FOUND,
      });
    }
  };

  getMessages = async (request, response) => {
    const userId = request.body.userId;
    const toUserId = request.body.toUserId;
    if (userId === "") {
      response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.USERID_NOT_FOUND,
      });
    }
    try {
      const messageResponse = await chat_db_handler.getMessages({
        userId: userId,
        toUserId: toUserId,
      });
      response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error: false,
        messages: messageResponse,
      });
    } catch (error) {
      response.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.USER_NOT_LOGGED_IN,
      });
    }
  };

  getChatList = async (request, response) => {
    const userId = request.body.userId;
    if (userId === "") {
      response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.USERID_NOT_FOUND,
      });
    }
    try {
      const chatListResponse = await chat_db_handler.getChatList(userId);
      response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
        error: false,
        chatList: chatListResponse,
      });
    } catch (error) {
      response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
        error: true,
        message: CONSTANTS.USER_NOT_LOGGED_IN,
      });
    }
  };
}

module.exports = new AuthenticationHandler();
