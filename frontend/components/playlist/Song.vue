<template>
  <v-card
    class="mx-auto song-element"
    @click="clickedSong"
    @contextmenu="$emit('contextmenu', $event, id)"
  >
    <v-img class="white--text align-end song-image" :src="thumbnail"></v-img>

    <v-card-text class="white--text text-truncate text-no-wrap song-title">
      <div class="white--text text-truncate-inner">{{ title }}</div>

      <div>{{ votes }} vote{{votes > 1 || votes == 0 ? "s" : null }}</div>
    </v-card-text>
    <div class="more-info-button" @click="$emit('contextmenu', $event, id)">. . .</div>
  </v-card>
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
    clickedSong: function(e) {
      e.preventDefault();
      if (e.target.className === "more-info-button") {
        return;
      }
      console.log("Clicked on song with info", this.title, this.id);
    }
  }
};
</script>

<style scoped lang="scss">
.song-image {
  width: 25%;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-bottom-left-radius: 2.5px !important;
}
.song-element {
  display: flex;
  flex-direction: row;
  box-shadow: 0px 0px 2px #000000;
  background: #FFFFFF20;
  border-radius: 5px;
  margin: 5px 5px;
  cursor: pointer;
  margin-left: 8px;
  width: calc(100% - 16px);
  color: white;
  height: auto;

  & .song-context-button {
    width: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid black;
  }
}

.more-info-button {
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 12px;
}

.song-title {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-top-right-radius: 0;
  color: white !important;
  border-bottom-right-radius: 0 !important;
}

.text-truncate-inner {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>