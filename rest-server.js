require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

//Middleware

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:7000", credentials: true }));
const posts = [
  { username: "roger", title: "roger post 1" },
  { username: "freddy", title: "post 2" },
];

const news = [
  { username: "roger", title: "new 1", post: posts[0] },
  { username: "freddy", title: "new 2", post: posts[1] },
];

app.get("/posts", authenticateToken, (req, res) => {
  console.log("POST USER", req.user.username);
  res.json(posts.filter((post) => post.username === req.user.username));
});

app.get("/news", authenticateToken, (req, res) => {
  console.log(req.user.username);
  res.json(news.filter((newItem) => newItem.username === req.user.username));
});

function authenticateToken(req, res, next) {
  console.log("VERIFICANDO ACCESS TOKEN", req.headers["authorization"]);
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(403);

  try {
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401); //there's no a token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log("auth", user);
      if (err) return res.sendStatus(403); //it's no longer valid
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }

  // console.log(token);
}

app.listen(8002);
