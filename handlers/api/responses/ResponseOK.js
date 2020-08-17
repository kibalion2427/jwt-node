const CONSTANTS = require("../../../config/constants");
const { createAccessToken, createRefreshToken } = require("../helpers/Tokens");

class ResponseOK {
  constructor() {}
  userLoginOK(response, user) {
    return response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      error: false,
      userId: user._id,
      accessToken: createAccessToken(user.username),
      //   refreshToken: createRefreshToken(user.username),
      message: CONSTANTS.USER_LOGIN_OK,
    });
  }
  userRegisterOKResponse(response, user) {
    return response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      error: false,
      accessToken: createAccessToken(user.username),
      message: CONSTANTS.USER_REGISTRATION_OK,
    });
  }

  refreshTokenOKResponse(response, payload) {
    return response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      error: false,
      accessToken: createAccessToken(payload.username),
      message: CONSTANTS.REFRESH_TOKEN_OK,
    });
  }

  userLogoutOK(response) {
    return response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      error: false,
      message: CONSTANTS.USER_LOGGED_OUT,
    });
  }
  userNameAvailableOKResponse(response) {
    return response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      error: false,
      message: CONSTANTS.USERNAME_AVAILABLE_OK,
    });
  }
}

module.exports = new ResponseOK();
