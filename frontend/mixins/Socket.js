import store from "@/store";
import io from "socket.io-client";

export default {
  data() {
    return {
      alreadyCreated: false
    };
  },
  created() {
    if (this.alreadyCreated) {
      console.log("we already exist");
      return;
    }
    this.socket = io("localhost:8080");
    console.log("mounted");
    console.log(this.socket);
    this.addListeners();
    this.alreadyCreated = true;
  },
  computed: {
    nowPlaying: function() {
      return store.getters["playerModule/nowPlaying"];
    },
    channel: function() {
      return store.getters["playerModule/channel"];
    },
    socket: {
      set: function(socket) {
        store.dispatch("socketModule/setSocket", socket);
      },
      get: function() {
        console.log(store);
        return store.getters["socketModule/socket"];
      }
    }
  },
  methods: {
    emitToBackend(event, msg) {
      store.getters["socketModule/socket"].emit(event, msg);
    },
    songEnd() {
      const nowPlaying = store.getters["playerModule/nowPlaying"];
      const channel = store.getters["playerModule/channel"];
      store.getters["socketModule/socket"].emit("end", {
        id: nowPlaying.id,
        channel: channel
      });
    },
    getPosition() {
      store.getters["socketModule/socket"].emit("pos", {
        channel: store.getters["playerModule/channel"]
      });
    },
    vote(id) {
      store.getters["socketModule/socket"].emit("vote", {
        channel: store.getters["playerModule/channel"],
        id: id,
        type: "pos"
      });
    },
    addListeners() {
      console.log(this.socket);
      this.socket.on("channel", msg => {
        console.log("list", msg);
        if (msg.type == "list") {
          msg.playlist.sort(
            predicate(
              {
                name: "votes",
                reverse: true
              },
              {
                name: "added",
                reverse: false
              },
              {
                name: "title",
                reverse: false
              }
            )
          );
          store.dispatch("playerModule/setPlaylist", msg.playlist);
        } else if (msg.type == "vote") {
          const playlist = store.getters["playerModule/playlist"];
          let songToUpdate = playlist.find(song => song.id == msg.value);
          console.log(songToUpdate);
          songToUpdate.votes += 1;
          songToUpdate.added = msg.time;
          store.dispatch("playerModule/setPlaylist", playlist);
        }
      });

      this.socket.on("conf", msg => {
        console.log("conf", msg);
        if (msg.length == 1) {
          store.dispatch("playerModule/setChannelSettings", msg[0]);
        }
      });
      this.socket.on("np", msg => {
        console.log("got now playing");
        const playlist = store.getters["playerModule/playlist"];
        const currentPlaying = playlist.find(song => song.now_playing == true);
        if (msg.np.length == 0) {
          return;
        }
        if (msg.conf.length == 0) {
          return;
        }

        let nowPlaying = msg.np[0];
        let channelSettings = msg.conf[0];
        let timeSinceStart =
          msg.time - channelSettings.startTime + nowPlaying.start;
        nowPlaying.seek = timeSinceStart;

        const newNowPlaying = playlist.find(song => song.id == nowPlaying.id);
        newNowPlaying.now_playing = true;
        if (
          currentPlaying != undefined &&
          currentPlaying.id != newNowPlaying.id
        ) {
          currentPlaying.now_playing = false;
          currentPlaying.added = channelSettings.startTime;
          console.log(currentPlaying);
        }

        playlist.sort(
          predicate(
            {
              name: "votes",
              reverse: true
            },
            {
              name: "added",
              reverse: false
            },
            {
              name: "title",
              reverse: false
            }
          )
        );

        store.dispatch("playerModule/setPlaylist", playlist);
        store.dispatch("playerModule/setNowPlaying", nowPlaying);
        store.dispatch("playerModule/setChannelSettings", channelSettings);
      });

      this.socket.on("update_required", msg => {
        console.log("update required", msg);
      });
      this.socket.on("connect", msg => {
        this.socket.emit("list", {
          version: 6,
          channel: this.channel
        });
      });
    }
  }
};

function predicate() {
  var fields = [],
    n_fields = arguments.length,
    field,
    name,
    cmp;

  var default_cmp = function(a, b) {
      if (a == undefined) a = 0;
      if (b == undefined) b = 0;
      if (a === b) return 0;
      return a < b ? -1 : 1;
    },
    getCmpFunc = function(primer, reverse) {
      var dfc = default_cmp,
        // closer in scope
        cmp = default_cmp;
      if (primer) {
        cmp = function(a, b) {
          return dfc(primer(a), primer(b));
        };
      }
      if (reverse) {
        return function(a, b) {
          return -1 * cmp(a, b);
        };
      }
      return cmp;
    };

  // preprocess sorting options
  for (var i = 0; i < n_fields; i++) {
    field = arguments[i];
    if (typeof field === "string") {
      name = field;
      cmp = default_cmp;
    } else {
      name = field.name;
      cmp = getCmpFunc(field.primer, field.reverse);
    }
    fields.push({
      name: name,
      cmp: cmp
    });
  }

  // final comparison function
  return function(A, B) {
    var name, result;
    for (var i = 0; i < n_fields; i++) {
      result = 0;
      field = fields[i];
      name = field.name;

      result = field.cmp(A[name], B[name]);
      if (result !== 0) break;
    }
    return result;
  };
}
