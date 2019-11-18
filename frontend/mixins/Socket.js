import store from "@/store";
import io from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
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
    this.addListeners();
    this.alreadyCreated = true;
  },
  computed: {
    nowPlaying: function() {
      return store.getters["playerModule/nowPlaying"];
    },
    channel: function() {
      return store.getters["playerModule/channel"];
    }
  },
  methods: {
    emitToBackend(event, msg) {
      this.socket.emit(event, msg);
    },
    songEnd() {
      this.socket.emit("end", { id: this.nowPlaying, channel: this.channel });
    },
    getPosition() {
      this.socket.emit("pos", { channel: this.channel });
    },
    addListeners() {
      this.socket.on("channel", msg => {
        console.log("list", msg);
        if (msg.type == "list") {
          store.dispatch("playerModule/setPlaylist", msg.playlist);
        }
      });

      this.socket.on("conf", msg => {
        console.log("conf", msg);
        if (msg.length == 1) {
          store.dispatch("playerModule/setChannelSettings", msg[0]);
        }
      });
      this.socket.on("np", msg => {
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

        store.dispatch("playerModule/setNowPlaying", nowPlaying);
        store.dispatch("playerModule/setChannelSettings", channelSettings);
      });

      this.socket.on("update_required", msg => {
        console.log("update required");
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
