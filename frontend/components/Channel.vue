<template>
  <div>
    <div class="parallel-containers">
      <Player class="player" />
      <Playlist class="playlist" />
    </div>
  </div>
</template>

<script>
import store from "@/store";
import Player from "@/components/player/Player";
import Playlist from "@/components/playlist/Playlist";

export default {
  components: {
    Player,
    Playlist
  }
};
</script>

<style lang="scss" scoped>
.parallel-containers {
  display: flex;
  flex-direction: row;

  & .player {
    width: 100%;
  }
  & .playlist {
    width: 40vw;
  }
}
</style>