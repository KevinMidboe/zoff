<template>
  <v-app>
    <h1>Styleguide</h1>
    <div>
      <h2>Chat</h2>
      <Chat />
    </div>
    <div>
      <h2>Playlist-element</h2>
      <Playlist />
    </div>
  </v-app>
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