<template>
  <div class="song-container">
    <div
      class="song-voteable-container"
      @click="clickedSong"
      @contextmenu="$emit('contextmenu', $event, id)"
    >
      <div class="song-thumbnail">
        <img :src="thumbnail" :alt="title" />
        <span class="song-duration">{{ durationInString }}</span>
      </div>
      <div class="song-info">
        <div class="song-title">{{ title }}</div>
        <div class="song-votes">{{ votes }} vote{{votes > 1 || votes == 0 ? "s" : null }}</div>
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
    },
    duration: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      contextMenuOpen: false,
      mouseX: 0,
      mouseY: 0
    };
  },
  computed: {
    durationInString: function() {
      let time = this.duration;
      let minutes = Math.floor(time / 60);
      time = time - minutes * 60;
      let minutesString = (minutes + "").padStart(2, "0");
      let secondString = (time + "").padStart(2, "0");
      return `${minutesString}:${secondString}`;
    }
  },
  methods: {
    clickedSong: function() {
      console.log("Clicked on song with info", this.title, this.id);
    }
  }
};
</script>

<style scoped lang="scss">
.song-container {
  display: flex;
  flex-direction: row;
  color: white;

  .song-voteable-container {
    width: 75%;
    display: flex;

    & .song-votes {
        color: lightgrey;
    }

    & .song-thumbnail {
      width: 25%;
      position: relative;

      & img {
        width: 100%;
        height: 100%;
        border-top-left-radius: 7.5px;
        border-bottom-left-radius: 7.5px;
      }

      & .song-duration {
        position: absolute;
        bottom: 5px;
        left: 0px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 5px;
        padding: 0 5px;
        background: #000000A0;
        color:white;
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