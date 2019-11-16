import {
  pathThumbnails
} from "../settings/globals";

var express = require("express");
var router = express.Router();
var path = require("path");
var year = new Date().getYear() + 1900;
var path = require("path");
var analytics = "xx";
var google = {};
var adsense = "xx";
var adds = false;
var mongojs = require("mongojs");
var token_db = mongojs("tokens");
var Frontpage = require(pathThumbnails + "/handlers/frontpage.js");

var db = require(pathThumbnails + "/handlers/db.js");

try {
  google = require(path.join(
    path.join(__dirname, "../../config/"),
    "google.js"
  ));
  analytics = google.analytics;
  adsense = google.adsense;
} catch (e) {
  console.log(
    "(!) Missing file - /config/google.js Have a look at /config/google.example.js. This is for google analytics."
  );
}

try {
  var Recaptcha = require("express-recaptcha");
  var recaptcha_config = require(path.join(
    path.join(__dirname, "../../config/"),
    "recaptcha.js"
  ));
  var RECAPTCHA_SITE_KEY = recaptcha_config.site;
  var RECAPTCHA_SECRET_KEY = recaptcha_config.key;
  var recaptcha = new Recaptcha(RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY);
} catch (e) {
  console.log(
    "(!) Missing file - /config/recaptcha.js Have a look at /config/recaptcha.example.js."
  );
  var recaptcha = {
    middleware: {
      render: (req, res, next) => {
        res.recaptcha = "";
        next();
      }
    }
  };
}

router.use(recaptcha.middleware.render, function (req, res, next) {
  next(); // make sure we go to the next routes and don't stop here
});

router.route("/:channel_name").get(function (req, res, next) {
  channel(req, res, next);
});

router.route("/r/:base64data").get(function (req, res, next) {
  var channelToRedirect = Buffer.from(req.params.base64data, "base64");
  res.redirect("/" + channelToRedirect);
});

router.route("/").get(function (req, res, next) {
  root(req, res, next);
});

router.route("/").post(function (req, res, next) {
  root(req, res, next);
});

router.route("/api/embed").get(function (req, res, next) {
  var data = {
    year: year,
    type: "video",
    javascript_file: "embed.min.js",
    captcha: res.recaptcha,
    analytics: analytics,
    stylesheet: "embed.css",
    embed: true,
    og_image: "https://zoff.me/assets/images/small-square.jpg"
  };
  res.render("layouts/client/embed", data);
});

router.route("/api/oauth").get(function (req, res, next) {
  res.sendFile(path.join(pathThumbnails, "/public/assets/html/callback.html"));
});

router.route("/api/apply").get(function (req, res, next) {
  var data = {
    year: year,
    javascript_file: "token.min.js",
    captcha: res.recaptcha,
    analytics: analytics,
    adsense: adsense,
    adds: adds,
    type: "website",
    activated: false,
    id: "",
    correct: false,
    stylesheet: "style.css",
    embed: false,
    og_image: "https://zoff.me/assets/images/small-square.jpg"
  };
  res.render("layouts/client/token", data);
});

router.route("/api/apply/:id").get(function (req, res) {
  var id = req.params.id;
  token_db.collection("api_links").find({
    id: id
  }, function (err, result) {
    if (result.length == 1) {
      token_db.collection("api_links").remove({
        id: id
      }, function (e, d) {
        token_db
          .collection("api_token")
          .update({
              token: result[0].token
            }, {
              $set: {
                active: true
              }
            },
            function (e, d) {
              var data = {
                year: year,
                javascript_file: "token.min.js",
                captcha: res.recaptcha,
                analytics: analytics,
                adsense: adsense,
                adds: adds,
                activated: true,
                type: "website",
                token: result[0].token,
                correct: true,
                stylesheet: "style.css",
                embed: false,
                og_image: "https://zoff.me/assets/images/small-square.jpg"
              };
              res.render("layouts/client/token", data);
            }
          );
      });
    } else {
      var data = {
        year: year,
        javascript_file: "token.min.js",
        captcha: res.recaptcha,
        analytics: analytics,
        adsense: adsense,
        adds: adds,
        activated: false,
        token: "",
        type: "website",
        correct: false,
        stylesheet: "style.css",
        embed: false,
        og_image: "https://zoff.me/assets/images/small-square.jpg"
      };
      res.render("layouts/client/token", data);
    }
  });
});

function root(req, res, next) {
  try {
    var url = req.headers["x-forwarded-host"] ?
      req.headers["x-forwarded-host"] :
      req.headers.host.split(":")[0];
    var subdomain = req.headers["x-forwarded-host"] ?
      req.headers["x-forwarded-host"].split(".") :
      req.headers.host.split(":")[0].split(".");
    if (subdomain[0] == "remote") {
      var data = {
        year: year,
        javascript_file: "remote.min.js",
        captcha: res.recaptcha,
        adsense: adsense,
        adds: adds,
        analytics: analytics,
        type: "website",
        stylesheet: "style.css",
        embed: false,
        client: false,
        og_image: "https://zoff.me/assets/images/small-square.jpg"
      };
      res.render("layouts/client/remote", data);
    } else if (subdomain[0] == "www") {
      res.redirect("https://zoff.me");
    } else {
      var data = {
        year: year,
        javascript_file: "main.min.js",
        captcha: res.recaptcha,
        adsense: adsense,
        adds: adds,
        analytics: analytics,
        stylesheet: "style.css",
        type: "website",
        embed: false,
        client: false,
        og_image: "https://zoff.me/assets/images/small-square.jpg",
        channels: []
      };
      if (subdomain[0] == "client") {
        data.client = true;
      }
      Frontpage.get_frontpage_lists(function (err, docs) {
        db.collection("connected_users").find({
          _id: "total_users"
        }, function (
          err,
          tot
        ) {
          if (docs.length > 0) {
            data.channels_exist = true;
            data.channels = docs.slice(0, 12);
            data.channel_list = JSON.stringify(docs);
          } else {
            data.channels_exist = false;
            data.channels = [];
            data.channel_list = [];
          }
          data.viewers = tot[0].total_users.length;
          res.render("layouts/client/frontpage", data);
        });
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function channel(req, res, next) {
  try {
    var url = req.headers["x-forwarded-host"] ?
      req.headers["x-forwarded-host"] :
      req.headers.host.split(":")[0];
    var subdomain = req.headers["x-forwarded-host"] ?
      req.headers["x-forwarded-host"].split(".") :
      req.headers.host.split(":")[0].split(".");
    if (subdomain[0] == "remote") {
      var data = {
        year: year,
        javascript_file: "remote.min.js",
        captcha: res.recaptcha,
        adsense: adsense,
        adds: adds,
        analytics: analytics,
        type: "website",
        stylesheet: "style.css",
        embed: false,
        client: false,
        og_image: "https://zoff.me/assets/images/small-square.jpg"
      };
      res.render("layouts/client/remote", data);
    } else if (subdomain.length >= 2 && subdomain[0] == "www") {
      res.redirect("https://zoff.me");
    } else {
      if (req.params.channel_name == "o_callback") {
        res.redirect("/api/oauth");
      } else {
        var data = {
          title: "404: File Not Found",
          list_name: capitalizeFirstLetter(req.params.channel_name),
          year: year,
          javascript_file: "main.min.js",
          captcha: res.recaptcha,
          adsense: adsense,
          adds: adds,
          analytics: analytics,
          type: "video",
          stylesheet: "style.css",
          embed: false,
          client: false,
          og_image: "https://zoff.me/assets/images/small-square.jpg"
        };
        if (subdomain[0] == "client") {
          data.client = true;
        }
        res.render("layouts/client/channel", data);
      }
    }
  } catch (e) {
    res.redirect("https://zoff.me");
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;