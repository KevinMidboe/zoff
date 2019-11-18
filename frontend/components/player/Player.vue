<template>
  <div class="conatiner">
    <h1>Player</h1>
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
    YouTube,
  },
  data() {
    return {
      done: false,
      player: undefined
    };
  },
  methods: {
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