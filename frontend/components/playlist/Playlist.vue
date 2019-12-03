<template>
  <div class="playlist-conatiner">
    <div class="playlist-element" v-for="(song, i) in paginatedList" :key="i">
      <Song
        class="song"
        :title="song.title"
        :thumbnail="song.thumbnail"
        :votes="song.votes"
        :addedBy="song.added_by"
        :id="song.id"
        :type="song.type"
        :duration="song.duration"
        @contextmenu="moreInfo"
      />
    </div>
    <div class="pagination-buttons">
      <v-btn text @click="firstPage" :disabled="disabledPrev" class="first"><</v-btn>
      <v-btn text @click="prevPage" :disabled="disabledPrev">previous</v-btn>
      <span>{{ page + 1 }}&nbsp;/&nbsp;{{ pages }}</span>
      <v-btn text @click="nextPage" :disabled="disabledNext">next</v-btn>
      <v-btn text @click="lastPage" :disabled="disabledNext" class="last">></v-btn>
    </div>
    <ContextMenu
      v-if="contextMenuOpen"
      :addedBy="contextOnElement.added_by"
      :id="contextOnElement.id"
      :type="contextOnElement.type"
      :mouseX="mouseX"
      :mouseY="mouseY"
      @closeContextMenu="closeContextMenu"
    />
  </div>
</template>

<script>
import store from "@/store";
import Song from "@/components/playlist/Song";
import ContextMenu from "@/components/playlist/ContextMenu";

export default {
  components: {
    Song,
    ContextMenu
  },
  computed: {
    paginatedList: function() {
      return this.playlist
        .filter(song => !song.now_playing)
        .slice(this.page * this.perPage, (1 + this.page) * this.perPage);
    },
    disabledPrev: function() {
      return this.page == 0;
    },
    disabledNext: function() {
      return this.playlist.length < (this.page + 1) * this.perPage;
    },
    pages: function() {
      return Math.ceil(this.playlist.length / this.perPage);
    },
    playlist: function() {
      return store.getters["playerModule/playlist"];
    }
  },
  methods: {
    moreInfo: function(e, id) {
      e.preventDefault();
      this.contextOnElement = this.playlist.find(song => song.id == id);
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
      this.contextMenuOpen = true;
    },
    closeContextMenu: function() {
      this.contextMenuOpen = false;
      this.contextOnElement = null;
    },
    firstPage: function() {
      this.page = 0;
    },
    lastPage: function() {
      this.page = Math.floor(this.playlist.length / this.perPage);
    },
    prevPage: function() {
      if (this.page == 0) {
        return;
      }
      this.page -= 1;
    },
    nextPage: function() {
      if (this.playlist.length < (this.page + 1) * this.perPage) {
        return;
      }
      this.page += 1;
    }
  },
  data() {
    return {
      contextMenuOpen: false,
      contextOnElement: {},
      page: 0,
      perPage: 12
    };
  }
};
</script>

<style scoped lang="scss">
.playlist-conatiner {
  background-color: inherit;
  padding-top: 5px;
  margin: auto;
  width: 100%;
  background: #2d2d2d;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  // & .playlist-element {
  //   height: 100%;
  // }

  .pagination-buttons {
    display: flex;
    justify-content: space-between;
    color: white;
    padding: 10px 0;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;

    & span {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    & button {
      width: 20%;
      height: 30px;
      background: transparent;
      color: white;
      border: none;

      &.first,
      &.last {
        width: 10%;
      }
    }
  }
}
</style>