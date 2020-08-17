require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const TIME_TO_EXPIRE_ACCESS_TOKEN = process.env.TIME_TO_EXPIRE_ACCESS_TOKEN;

module.exports = {
  createAccessToken: function (user) {
    return sign({ username: user }, ACCESS_TOKEN_SECRET, {
      expiresIn: TIME_TO_EXPIRE_ACCESS_TOKEN,
    });
  },
  createRefreshToken: function (user) {
    return sign({ username: user }, REFRESH_TOKEN_SECRET);
  },
  verifyRefreshToken: function (token) {
    return verify(token, REFRESH_TOKEN_SECRET);
  },
};
