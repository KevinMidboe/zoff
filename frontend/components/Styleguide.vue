<template>
  <div>
    <h1>Styleguide</h1>
    <div class="row">
      <h2>Chat</h2>
      <Chat />
    </div>
    <div class="row">
      <h2>Playlist-element</h2>
      <Playlist />
    </div>
  </div>
</template>


<script>
import Playlist from "@/components/playlist/Playlist";
import Chat from "@/components/chat/Chat";

export default {
  components: {
    Chat,
    Playlist
  },
};
</script>


<style lang="scss" scoped>
</style>