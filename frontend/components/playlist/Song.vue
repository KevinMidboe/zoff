<template>
  <div class="song-container">
    <div class="song-voteable-container" @click="clickedSong" @contextmenu="$emit('contextmenu', $event, id)">
      <div class="song-thumbnail">
        <img :src="thumbnail" :alt="title" />
      </div>
      <div class="song-info">
        <div class="song-title">{{ title }}</div>
        <div class="song-votes">{{ votes }} vote{{votes > 1 ? "s" : null }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ContextMenu from "@/components/playlist/ContextMenu";

export default {
  components: {
    ContextMenu
  },
  props: {
    id: {
      required: true,
      type: String
    },
    thumbnail: {
      required: true,
      type: String
    },
    title: {
      required: true,
      type: String
    },
    votes: {
      required: true,
      type: Number
    },
    addedBy: {
      required: true,
      type: String
    },
    type: {
        required: true,
        type: String
    }
  },
  data() {
    return {
      contextMenuOpen: false,
      mouseX: 0,
      mouseY: 0
    };
  },
  methods: {
    clickedSong: function() {
      console.log("Clicked on song with info", this.title, this.id);
    },

  }
};
</script>

<style scoped lang="scss">
.song-container {
  display: flex;
  flex-direction: row;

  .song-voteable-container {
    width: 75%;
    display: flex;

    & .song-thumbnail {
      width: 25%;

      & img {
        width: 100%;
        border-top-left-radius: 7.5px;
        border-bottom-left-radius: 7.5px;
      }
    }

    & .song-info {
      width: 100%;
      padding-left: 10px;
      display: flex;
      justify-content: space-evenly;
      flex-direction: column;
    }
  }

  & .song-mutation {
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>