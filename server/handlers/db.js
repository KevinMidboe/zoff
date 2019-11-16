import {
  join
} from "path";
import mongojs from 'mongojs';

try {
  var mongo_config = require(
    join(__dirname, "../config/mongo_config.js"),
    "mongo_config.js"
  );
} catch (e) {
  console.log(
    "(!) Missing file - /config/mongo_config.js. Have a look at /config/mongo_config.example.js.  The server won't run without this existing."
  );
  process.exit(1);
}
const db = mongojs("mongodb://" + mongo_config.host + "/" + mongo_config.config);

db.collection("chat_logs").createIndex({
    createdAt: 1
  }, {
    expireAfterSeconds: 600
  },
  function () {}
);

db.collection("timeout_api").createIndex({
    createdAt: 1
  }, {
    expireAfterSeconds: 120
  },
  function () {}
);

db.collection("api_links").createIndex({
    createdAt: 1
  }, {
    expireAfterSeconds: 86400
  },
  function () {}
);

db.on("connected", function (err) {
  console.log("connected");
});

db.on("error", function (err) {
  console.log("\n" + new Date().toString() + "\n Database error: ", err);
});

db.on("error", function (err) {
  console.log("\n" + new Date().toString() + "\n Database error: ", err);
});

/* Resetting usernames, and connected users */
db.collection("unique_ids").update({
    _id: "unique_ids"
  }, {
    $set: {
      unique_ids: []
    }
  }, {
    multi: true,
    upsert: true
  },
  function (err, docs) {}
);

db.collection("user_names").remove({
    guid: {
      $exists: true
    }
  }, {
    multi: true,
    upsert: true
  },
  function (err, docs) {}
);

db.collection("user_names").update({
    _id: "all_names"
  }, {
    $set: {
      names: []
    }
  }, {
    multi: true,
    upsert: true
  },
  function (err, docs) {}
);

db.collection("connected_users").update({
    users: {
      $exists: true
    }
  }, {
    $set: {
      users: []
    }
  }, {
    multi: true,
    upsert: true
  },
  function (err, docs) {}
);

db.collection("connected_users").update({
    _id: "total_users"
  }, {
    $set: {
      total_users: []
    }
  }, {
    multi: true,
    upsert: true
  },
  function (err, docs) {}
);

db.collection("frontpage_lists").update({
    viewers: {
      $ne: 0
    }
  }, {
    $set: {
      viewers: 0
    }
  }, {
    multi: true,
    upsert: true
  },
  function (err, docs) {}
);

export default db;