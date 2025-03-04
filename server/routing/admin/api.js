var express = require("express");
var router = express.Router();
var path = require("path");
try {
  var mongo_db_cred = require(path.join(
    __dirname,
    "../../config/mongo_config.js"
  ));
} catch (e) {
  console.log(
    "(!) Missing file - /config/mongo_config.js. Have a look at /config/mongo_config.example.js.  The server won't run without this existing."
  );
  process.exit(1);
}
var mongojs = require("mongojs");
var db = mongojs(mongo_db_cred.config);
var token_db = mongojs("tokens");
var uniqid = require("uniqid");
var crypto = require("crypto");
var ObjectId = mongojs.ObjectId;
var sIO = require(path.join(__dirname, "../../apps/client.js")).socketIO;
var projects = require(pathThumbnails + "/handlers/aggregates.js");

router.use(function(req, res, next) {
  next(); // make sure we go to the next routes and don't stop here
});

router.route("/api/lists").get(function(req, res) {
  if (req.isAuthenticated()) {
    db.collection("frontpage_lists")
      .find()
      .sort({ count: -1 }, function(err, docs) {
        res.json(docs);
      });
  } else {
    res.send(false);
  }
});

router.route("/api/thumbnails").get(function(req, res) {
  if (req.isAuthenticated()) {
    db.collection("suggested_thumbnails").find(function(err, docs) {
      res.json(docs);
    });
  } else {
    res.send(false);
  }
});

router.route("/api/descriptions").get(function(req, res) {
  if (req.isAuthenticated()) {
    db.collection("suggested_descriptions").find(function(err, docs) {
      res.json(docs);
    });
  } else {
    res.send(false);
  }
});

router.route("/api/rules").get(function(req, res) {
  if (req.isAuthenticated()) {
    db.collection("suggested_rules").find(function(err, docs) {
      res.json(docs);
    });
  } else {
    res.send(false);
  }
});

router.route("/api/approve_thumbnail").post(function(req, res) {
  if (req.isAuthenticated()) {
    var channel = req.body.channel;
    db.collection("suggested_thumbnails").find({ channel: channel }, function(
      err,
      docs
    ) {
      var thumbnail = docs[0].thumbnail;
      db.collection("frontpage_lists").update(
        { _id: channel },
        { $set: { thumbnail: thumbnail } },
        { upsert: true },
        function(err, docs) {
          db.collection(channel + "_settings").update(
            { views: { $exists: true } },
            { $set: { thumbnail: thumbnail } },
            { upsert: true },
            function(err, docs) {
              db.collection("suggested_thumbnails").remove(
                { channel: channel },
                function(err, docs) {
                  db.collection(channel + "_settings").aggregate(
                    [
                      {
                        $match: {
                          id: "config"
                        }
                      },
                      {
                        $project: projects.toShowConfig
                      }
                    ],
                    function(err, docs) {
                      if (docs[0].adminpass !== "") docs[0].adminpass = true;
                      if (
                        docs[0].hasOwnProperty("userpass") &&
                        docs[0].userpass != ""
                      )
                        docs[0].userpass = true;
                      else docs[0].userpass = false;
                      sIO.to(channel).emit("conf", docs);
                      res.send(true);
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  } else {
    res.send(false);
  }
});

router.route("/api/deny_thumbnail").post(function(req, res) {
  if (req.isAuthenticated()) {
    var channel = req.body.channel;
    db.collection("suggested_thumbnails").remove({ channel: channel }, function(
      err,
      docs
    ) {
      res.send(true);
    });
  } else {
    res.send(false);
  }
});

router.route("/api/approve_rules").post(function(req, res) {
  if (req.isAuthenticated()) {
    var channel = req.body.channel;
    db.collection("suggested_rules").find({ channel: channel }, function(
      err,
      docs
    ) {
      var rules = docs[0].rules;
      db.collection(channel + "_settings").update(
        { views: { $exists: true } },
        { $set: { rules: rules } },
        { upsert: true },
        function(err, docs) {
          db.collection("suggested_rules").remove(
            { channel: channel },
            function(err, docs) {
              db.collection(channel + "_settings").aggregate(
                [
                  {
                    $match: {
                      id: "config"
                    }
                  },
                  {
                    $project: projects.toShowConfig
                  }
                ],
                function(err, docs) {
                  if (docs[0].adminpass !== "") docs[0].adminpass = true;
                  if (
                    docs[0].hasOwnProperty("userpass") &&
                    docs[0].userpass != ""
                  )
                    docs[0].userpass = true;
                  else docs[0].userpass = false;
                  sIO.to(channel).emit("conf", docs);
                  res.send(true);
                }
              );
            }
          );
        }
      );
    });
  } else {
    res.send(false);
  }
});

router.route("/api/deny_rules").post(function(req, res) {
  if (req.isAuthenticated()) {
    var channel = req.body.channel;
    db.collection("suggested_rules").remove({ channel: channel }, function(
      err,
      docs
    ) {
      res.send(true);
    });
  } else {
    res.send(false);
  }
});

router.route("/api/remove_rules").post(function(req, res) {
  if (req.isAuthenticated()) {
    var channel = req.body.channel;
    db.collection(channel + "_settings").update(
      { views: { $exists: true } },
      { $set: { rules: "" } },
      function(err, docs) {
        db.collection(channel + "_settings").aggregate(
          [
            {
              $match: {
                id: "config"
              }
            },
            {
              $project: projects.toShowConfig
            }
          ],
          function(err, docs) {
            if (docs[0].adminpass !== "") docs[0].adminpass = true;
            if (docs[0].hasOwnProperty("userpass") && docs[0].userpass != "")
              docs[0].userpass = true;
            else docs[0].userpass = false;
            sIO.to(channel).emit("conf", docs);
            res.send(true);
          }
        );
      }
    );
  } else {
    res.send(false);
  }
});

router.route("/api/approve_description").post(function(req, res) {
  if (req.isAuthenticated()) {
    var channel = req.body.channel;
    db.collection("suggested_descriptions").find({ channel: channel }, function(
      err,
      docs
    ) {
      var description = docs[0].description;
      db.collection("frontpage_lists").update(
        { _id: channel },
        { $set: { description: description } },
        { upsert: true },
        function(err, docs) {
          db.collection(channel + "_settings").update(
            { views: { $exists: true } },
            { $set: { description: description } },
            function(err, docs) {
              db.collection("suggested_descriptions").remove(
                { channel: channel },
                function(err, docs) {
                  db.collection(channel + "_settings").aggregate(
                    [
                      {
                        $match: {
                          id: "config"
                        }
                      },
                      {
                        $project: projects.toShowConfig
                      }
                    ],
                    function(err, docs) {
                      if (docs[0].adminpass !== "") docs[0].adminpass = true;
                      if (
                        docs[0].hasOwnProperty("userpass") &&
                        docs[0].userpass != ""
                      )
                        docs[0].userpass = true;
                      else docs[0].userpass = false;
                      sIO.to(channel).emit("conf", docs);
                      res.send(true);
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  } else {
    res.send(false);
  }
});

router.route("/api/deny_description").post(function(req, res) {
  if (req.isAuthenticated()) {
    var channel = req.body.channel;
    db.collection("suggested_descriptions").remove(
      { channel: channel },
      1,
      function(err, docs) {
        res.send(true);
      }
    );
  } else {
    res.send(false);
  }
});

router.route("/api/remove_thumbnail").post(function(req, res) {
  if (req.isAuthenticated()) {
    var channel = req.body.channel;
    db.collection("frontpage_lists").update(
      { _id: channel },
      { $set: { thumbnail: "" } },
      function(err, docs) {
        db.collection(channel + "_settings").update(
          { views: { $exists: true } },
          { $set: { thumbnail: "" } },
          function(err, docs) {
            db.collection(channel + "_settings").aggregate(
              [
                {
                  $match: {
                    id: "config"
                  }
                },
                {
                  $project: projects.toShowConfig
                }
              ],
              function(err, docs) {
                if (docs[0].adminpass !== "") docs[0].adminpass = true;
                if (
                  docs[0].hasOwnProperty("userpass") &&
                  docs[0].userpass != ""
                )
                  docs[0].userpass = true;
                else docs[0].userpass = false;
                sIO.to(channel).emit("conf", docs);
                res.send(true);
              }
            );
          }
        );
      }
    );
  } else {
    res.send(false);
  }
});

router.route("/api/remove_description").post(function(req, res) {
  if (req.isAuthenticated()) {
    var channel = req.body.channel;
    db.collection("frontpage_lists").update(
      { _id: channel },
      { $set: { description: "" } },
      function(err, docs) {
        db.collection(channel + "_settings").update(
          { views: { $exists: true } },
          { $set: { description: "" } },
          function(err, docs) {
            db.collection(channel + "_settings").aggregate(
              [
                {
                  $match: {
                    id: "config"
                  }
                },
                {
                  $project: projects.toShowConfig
                }
              ],
              function(err, docs) {
                if (docs[0].adminpass !== "") docs[0].adminpass = true;
                if (
                  docs[0].hasOwnProperty("userpass") &&
                  docs[0].userpass != ""
                )
                  docs[0].userpass = true;
                else docs[0].userpass = false;
                sIO.to(channel).emit("conf", docs);
                res.send(true);
              }
            );
          }
        );
      }
    );
  } else {
    res.send(false);
  }
});

router.route("/api/names").get(function(req, res) {
  if (req.isAuthenticated()) {
    db.collection("registered_users").find(
      { _id: { $exists: true } },
      { _id: 1, icon: 1 },
      function(err, docs) {
        res.json(docs);
      }
    );
  } else {
    res.send(false);
  }
});

router.route("/api/names").post(function(req, res) {
  if (req.isAuthenticated()) {
    var icon = req.body.icon;
    var name = req.body.name;
    db.collection("registered_users").update(
      { _id: name },
      { $set: { icon: icon } },
      function(err, docs) {
        if (err) res.send(false);
        else res.send(true);
      }
    );
  } else {
    res.send(false);
  }
});

router.route("/api/names").delete(function(req, res) {
  if (req.isAuthenticated()) {
    var name = req.body.name;
    db.collection("registered_users").remove({ _id: name }, function(
      err,
      docs
    ) {
      if (err) res.send(false);
      else res.send(true);
    });
  } else {
    res.send(false);
  }
});

router.route("/api/token").get(function(req, res) {
  if (req.isAuthenticated()) {
    token_db.collection("tokens").find(function(err, docs) {
      if (docs.length == 1) {
        res.json({ token: docs[0].token });
      } else {
        var id = new Buffer(makeid()).toString("base64");
        token_db
          .collection("tokens")
          .insert({ token: id }, function(err, docs) {
            res.json({ token: id });
          });
      }
    });
  } else {
    res.send(false);
  }
});

router.route("/api/api_token").get(function(req, res) {
  if (req.isAuthenticated()) {
    token_db
      .collection("api_token")
      .find({ token: { $exists: true } }, function(err, all) {
        res.json(all);
      });
  } else {
    res.sendStatus(403);
  }
});

router.route("/api/api_token").delete(function(req, res) {
  if (req.isAuthenticated()) {
    var id = req.body.id;
    token_db
      .collection("api_token")
      .remove({ _id: ObjectId(id) }, function(err, success) {
        if (err) {
          res.send("failed");
          return;
        }
        res.send("success");
      });
  }
});

router.route("/api/api_token").put(function(req, res) {
  if (req.isAuthenticated()) {
    var id = req.body.id;
    var limit = req.body.limit;
    if (limit < 0) {
      res.sendStatus(500);
      return;
    }
    token_db
      .collection("api_token")
      .update({ _id: ObjectId(id) }, { $set: { limit: limit } }, function(
        err,
        success
      ) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
  }
});

router.route("/api/api_token").post(function(req, res) {
  if (req.isAuthenticated()) {
    var name = req.body.name;
    var id = crypto
      .createHash("sha256")
      .update(uniqid())
      .digest("base64");
    token_db
      .collection("api_token")
      .insert({ name: name, token: id, usage: 0 }, function(err, docs) {
        token_db.collection("api_token").find({ token: id }, function(err, d) {
          res.json({ token: id, _id: d[0]._id });
        });
      });
  } else {
    res.send(false);
  }
});

router.route("/api/delete").post(function(req, res) {
  if (req.isAuthenticated()) {
    var list = req.body._id;
    db.collection(list).drop(function(err, docs) {
      db.collection(list + "_settings").drop(function(err, docs) {
        db.collection("frontpage_lists").remove({ _id: list }, function(
          err,
          docs
        ) {
          res.send(true);
        });
      });
    });
  } else {
    res.send(false);
  }
});

router.route("/api/remove_token").get(function(req, res) {
  if (req.isAuthenticated()) {
    token_db.collection("tokens").find(function(err, docs) {
      if (docs.length == 1) {
        token_db
          .collection("tokens")
          .remove({ token: docs[0].token }, function(err, docs) {
            res.send(true);
          });
      } else {
        res.send(false);
      }
    });
  } else {
    res.send(false);
  }
});

router.route("/api/pinned").post(function(req, res) {
  if (req.isAuthenticated()) {
    var to_pin = req.body._id;
    db.collection("frontpage_lists").update(
      { pinned: 1 },
      { $set: { pinned: 0 } },
      function(err, resp) {
        db.collection("frontpage_lists").update(
          { _id: to_pin },
          { $set: { pinned: 1 } },
          function(err, resp) {
            res.send(true);
          }
        );
      }
    );
  } else {
    res.send(false);
  }
});

router.route("/api/admin").post(function(req, res) {
  if (req.isAuthenticated()) {
    var to_remove = req.body._id;
    db.collection(to_remove + "_settings").update(
      { views: { $exists: true } },
      { $set: { adminpass: "" } },
      function(err, docs) {
        res.send(true);
      }
    );
  } else {
    res.send(false);
  }
});

router.route("/api/userpass").post(function(req, res) {
  if (req.isAuthenticated()) {
    var to_remove = req.body._id;
    db.collection(to_remove + "_settings").update(
      { views: { $exists: true } },
      { $set: { userpass: "" } },
      function(err, docs) {
        res.send(true);
      }
    );
  } else {
    res.send(false);
  }
});

function makeid() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = router;
