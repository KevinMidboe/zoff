<template>
  <div class="conatiner">
    <YouTube
      @end="end('youtube')"
      @pause="pause('youtube')"
      @play="play('youtube')"
      @buffering="buffering('youtube')"
    />
  </div>
</template>

<script>
import store from "@/store";
import YouTube from "@/components/player/YouTube";

export default {
  components: {
    YouTube
  },
  data() {
    return {
      done: false,
      player: undefined
    };
  },
  mounted() {
    this.sockets.subscribe("np", msg => {
      this.gotNewNowPlaying(msg);
    });
  },
  methods: {
    gotNewNowPlaying: function(msg) {
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
      console.log(this.predicate);
      playlist.sort(
        this.predicate(
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
    },
    play: function(source) {},
    pause: function(source) {},
    end: function(source) {},
    buffering: function(source) {}
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
