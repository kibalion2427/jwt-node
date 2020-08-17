"use strict";
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const TIME_TO_EXPIRE_ACCESS_TOKEN = process.env.TIME_TO_EXPIRE_ACCESS_TOKEN;

//Middleware

app.use(express.json());

let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken: accessToken });
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { username: username };

  //Authenticate user
  //(find in db and compare password)

  //if true reponse token else response status error
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: TIME_TO_EXPIRE_ACCESS_TOKEN,
  });
}

function generateRefreshToken(user) {
  return jwt.sign(user, REFRESH_TOKEN_SECRET);
}

app.listen(8001);
