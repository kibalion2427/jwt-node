const expressConfig = require("./express-config");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

class AppConfig {
  constructor(app) {
    dotenv.config();
    this.app = app;
  }

  includeConfig() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(cors({ origin: "http://localhost:7000", credentials: true }));
    // this.app.use(function (req, res, next) {
    //   res.header("Access-Control-Allow-Credentials", true);
    //   res.header("Access-Control-Allow-Origin", req.headers.origin);
    //   res.header(
    //     "Access-Control-Allow-Methods",
    //     "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
    //   );
    //   res.header(
    //     "Access-Control-Allow-Headers",
    //     "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
    //   );
    //   next();
    // });
    new expressConfig(this.app);
  }
}

module.exports = AppConfig;
