<template>
  <div class="conatiner">
    <h1>Player</h1>
    <div id="player"></div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      done: false,
      player: undefined
    }
  },
  beforeMount() {
    this.loadYoutubeIframe()
  },
  watch: {
    done: function(val) {
      console.log('done changed to:', val)
      if (val === true) {
        this.player.playVideo();
      }
    }
  },
  methods: {
    loadYoutubeIframe() {
      // const tag = this.$refs.player;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      const that = this;
      // setTimeout(() => that.onYouTubeIframeAPIReady(), 2000);
      window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady
    },
    onYouTubeIframeAPIReady() {
      console.log('we are loaded and ready to fucking go!')
      this.player = new YT.Player('player', {
        videoId: 'SJOgTMP8cs4',
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
    },
    onPlayerReady(event) {
      console.log('event from onPlayerReady', event)
      event.target.playVideo();
    },
    onPlayerStateChange(event) {
      console.log('on player changed')
      if (event.data === YT.PlayerState.PLAYING && !this.done) {
        this.done = true
      }
    },
    errorHandler(error) {
      console.log('error handling youtube player. Error:', error)
    }
  }
}
</script>


<style lang="scss">
#player {
  width: 100vw !important;
  height: 60vh;
}
</style>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}

</style>