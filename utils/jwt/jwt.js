require("dotenv").config();
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const TIME_TO_EXPIRE_ACCESS_TOKEN = process.env.TIME_TO_EXPIRE_ACCESS_TOKEN;

class jwtAuth {
  generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET
    
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(user, REFRESH_TOKEN_SECRET);
  }
}

module.exports = new jwtAuth();
