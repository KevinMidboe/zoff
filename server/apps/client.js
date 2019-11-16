import {
  publicPath,
  handlersPath,
  clientRoutingPath,
  certAvailble
} from "../settings/globals";

let express = require("express");
let app = express();
let compression = require("compression");
let exphbs = require("express-handlebars");
let cors = require("cors");
let Functions = require(handlersPath + "/functions.js");

let hbs = exphbs.create({
  defaultLayout: publicPath + "/layouts/client/main",
  layoutsDir: publicPath + "/layouts/client",
  partialsDir: publicPath + "/partials",
  helpers: {
    if_equal: function (a, b, opts) {
      if (a == b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    },
    decodeString: function (s) {
      if (s == undefined) return s;
      return Functions.decodeChannelName(s);
    }
  }
});

let uniqid = require("uniqid");
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let referrerPolicy = require("referrer-policy");
let helmet = require("helmet");
let featurePolicy = require("feature-policy");

/* Globally needed "libraries" and files */
let router = require(clientRoutingPath + "/router.js");
let api_file = require(clientRoutingPath + "/api.js");
let api = api_file.router;
api_file.sIO = app.socketIO;
let ico_router = require(clientRoutingPath + "/icons_routing.js");

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.enable("view cache");
app.set("views", publicPath);
app.set("trust proxy", "127.0.0.1");

import {
  start
} from "../handlers/io";
app.socketIO = start();

app.use(compression({
  filter: shouldCompress
}));

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}
app.get("/robots.txt", function (req, res) {
  res.type("text/plain");
  res.send("User-agent: *\nAllow: /$\nDisallow: /");
});
app.use(
  featurePolicy({
    features: {
      fullscreen: ["*"],
      payment: ["'none'"],
      microphone: ["'none'"],
      camera: ["'none'"],
      speaker: ["*"],
      syncXhr: ["'self'"]
    }
  })
);
app.use(
  helmet({
    frameguard: false
  })
);
app.use(referrerPolicy({
  policy: "origin-when-cross-origin"
}));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
app.use(cookieParser());


app.use(function (req, res, next) {
  let cookie = req.cookies._uI;
  let skipElements = [
    "/_embed",
    "/assets/manifest.json",
    "/apple-touch-icon.png"
  ];
  if (skipElements.indexOf(req.originalUrl) > -1) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  } else {
    if (req.originalUrl.split("/").length > 3) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    } else {
      if (cookie === undefined) {
        var user_name = Functions.hash_pass(
          Functions.rndName(uniqid.time(), 15)
        );
        res.cookie("_uI", user_name, {
          maxAge: 365 * 10000 * 3600000,
          httpOnly: true,
          secure: certAvailble
        });
      } else {
        res.cookie("_uI", cookie, {
          maxAge: 365 * 10000 * 3600000,
          httpOnly: true,
          secure: certAvailble
        });
      }
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    }
  }
});

app.use("/service-worker.js", function (req, res) {
  res.sendFile(publicPath + "/service-worker.js");
});

app.use("/", ico_router);
app.use("/", api);
app.use("/", cors(), router);

app.use("/assets/js", function (req, res, next) {
  res.sendStatus(403);
  return;
});

app.use("/assets/admin", function (req, res, next) {
  res.sendStatus(403);
  return;
});

app.use("/assets", express.static(publicPath + "/assets"));

app.use(function (req, res, next) {
  res.status(404);
  res.redirect("/404");
});

module.exports = app;