module.exports = function sendRefreshToken(res, token) {
  // console.log("SET COOKIE", token);
  return res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh_token",
  });
};
