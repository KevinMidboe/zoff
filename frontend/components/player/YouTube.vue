<template>
  <div id="youtubePlayer"></div>
</template>

<script>
import store from "@/store";

export default {
  data() {
    return {
      initialLoad: true,
      player: null,
      playerReady: false,
      currentPlaying: {},
      currentIsThis: false
    };
  },
  computed: {
    nowPlaying: {
      get: function() {
        return store.getters["playerModule/nowPlaying"];
      }
    },
    playerState: {
      get: function() {
        if (!this.currentIsThis) {
          return this.PLAYER_STATES.PAUSED;
        }
        return store.getters["playerModule/playerState"];
      },
      set: function(state) {
        if (!this.currentIsThis) {
          return;
        }
        store.dispatch("playerModule/setPlayerState");
      }
    },
    PLAYER_STATES: function() {
      return store.getters["playerModule/PLAYER_STATES"];
    },
    channelSettings: function() {
      return store.getters["playerModule/channelSettings"];
    }
  },
  watch: {
    nowPlaying: function(nowPlaying) {
      this.currentIsThis = false;
      if (nowPlaying.source != "youtube") {
        return;
      }
      if (!this.playerReady) {
        return;
      }
      this.currentIsThis = true;

      if (this.player == null) {
        this.createYoutubeObjectWithId(this.nowPlaying.id);
      } else {
        if (this.currentPlaying.id != nowPlaying.id) {
          try {
            this.player.loadVideoById(nowPlaying.id, {
              start: nowPlaying.seek,
              end: nowPlaying.end
            });
          } catch (e) {}
        } else {
          this.player.seekTo(nowPlaying.seek);
        }
        this.currentPlaying = nowPlaying;
      }
    },
    playerState: function(state) {
      if (!this.currentIsThis) {
        return;
      }
      if (state === this.PLAYER_STATES.PLAYING) {
        this.player.playVideo();
      } else if (state === this.PLAYER_STATES.PAUSED) {
        this.player.pauseVideo();
      } else if (state === this.PLAYER_STATES.ENDED) {
        this.player.stopVideo();
      }
    }
  },
  beforeMount() {
    this.loadYoutubeIframe();
  },
  methods: {
    loadYoutubeIframe() {
      window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
    onYouTubeIframeAPIReady() {
      this.playerReady = true;
      if (
        this.nowPlaying != undefined &&
        this.nowPlaying.id != undefined &&
        this.player == null
      ) {
        this.createYoutubeObjectWithId(this.nowPlaying.id);
      }
    },
    createYoutubeObjectWithId(id) {
      if (this.player == null) {
        this.player = new YT.Player("youtubePlayer", {
          videoId: id,
          playerVars: {
            rel: "0",
            autoplay: 1,
            wmode: "transparent",
            controls: "0",
            fs: "0",
            iv_load_policy: "3",
            theme: "light",
            color: "white",
            showinfo: 0
          },
          events: {
            onReady: this.onPlayerReady,
            onStateChange: this.onPlayerStateChange,
            onError: this.errorHandler
          }
        });
      }
    },
    onPlayerReady(event) {
      console.log("event from onPlayerReady", event);
      event.target.playVideo();
    },
    checkForInitialLoadAndSeek() {
      if (!this.initialLoad) {
        return;
      }
      this.initialLoad = false;
      this.player.seekTo(this.nowPlaying.seek);
    },
    onPlayerStateChange(event) {
      console.log("event change", event);
      if (event.data === this.PLAYER_STATES.PLAYING) {
        console.log("playing");
        this.checkForInitialLoadAndSeek();
      } else if (event.data === this.PLAYER_STATES.ENDED) {
        console.log("ended");
        this.$root.$options.methods.songEnd();
      } else if (event.data === this.PLAYER_STATES.UNSTARTED) {
        console.log("not started");
      } else if (event.data === this.PLAYER_STATES.BUFFERING) {
        console.log("buffering");
      }
    },
    errorHandler(error) {
      console.log("error handling youtube player. Error:", error);
    }
  }
};
</script>

<style lang="scss">
#player {
  width: 100vw !important;
  height: 60vh;
}
</style>