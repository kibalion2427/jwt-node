const CONSTANTS = require("../../../config/constants");

class ResponseError {
  constructor() {}
  userLoginFailed(response) {
    return response
      .status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE)
      .json({ error: true, message: CONSTANTS.USER_LOGIN_FAILED });
  }
  userRegisterFailedResponse(response) {
    return response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
      error: true,
      message: CONSTANTS.USER_REGISTRATION_FAILED,
    });
  }
  userLogoutFailed(response) {
    return response
      .status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE)
      .json({ error: true, message: CONSTANTS.USER_LOGOUT_FAILED });
  }
  refreshTokenFailed(response) {
    return response.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
      error: false,
      accessToken: "",
      message: CONSTANTS.REFRESH_TOKEN_FAILED,
    });
  }
  userNotFound(response) {
    return response
      .status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE)
      .json({ error: true, message: CONSTANTS.USER_NOT_FOUND });
  }
  passwordNotFound(response) {
    return response
      .status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE)
      .json({ error: true, message: CONSTANTS.PASSWORD_NOT_FOUND });
  }
  tokenNotFound(response) {
    return response
      .status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE)
      .json({ error: true, message: CONSTANTS.TOKEN_NOT_FOUND });
  }
  invalidPassword(response) {
    response
      .status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE)
      .json({ error: true, message: CONSTANTS.INVALID_PASSWORD });
  }
  userDuplicatedResponse(response) {
    return response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
      error: true,
      message: CONSTANTS.USERNAME_DUPLICATED,
    });
  }
  usernameNotAvailableResponse(response) {
    return response.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
      error: true,
      message: CONSTANTS.USERNAME_AVAILABLE_FAILED,
    });
  }
  checkUserAvailableResponse(response) {
    return response.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
      error: true,
      message: CONSTANTS.CHECK_USER_ERROR,
    });
  }
}

module.exports = new ResponseError();
