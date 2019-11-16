<template>
  <div class="playlist-conatiner">
    <div class="song-container" v-for="(song, i) in paginatedList" :key="i">
      <Song
        class="song"
        :title="song.title"
        :thumbnail="song.thumbnail"
        :votes="song.votes"
        :addedBy="song.added_by"
        :id="song.id"
        :type="song.type"
        @contextmenu="moreInfo"
      />
      <div class="song-context-button" @click="moreInfo($event, song.id)">more</div>
    </div>
    <div class="pagination-buttons">
      <button @click="firstPage" :disabled="disabledPrev" class="first"><</button>
      <button @click="prevPage" :disabled="disabledPrev">previous</button>
      <span>{{ page + 1 }} / {{ pages }}</span>
      <button @click="nextPage" :disabled="disabledNext">next</button>
      <button @click="lastPage" :disabled="disabledNext" class="last">></button>
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
import Song from "@/components/playlist/Song";
import ContextMenu from "@/components/playlist/ContextMenu";

export default {
  components: {
    Song,
    ContextMenu
  },
  computed: {
    paginatedList: function() {
      return this.playlist.slice(
        this.page * this.perPage,
        (1 + this.page) * this.perPage
      );
    },
    disabledPrev: function() {
      return this.page == 0;
    },
    disabledNext: function() {
      return this.playlist.length < (this.page + 1) * this.perPage;
    },
    pages: function() {
      return Math.ceil(this.playlist.length / this.perPage);
    }
  },
  async beforeMount() {
    const request = await fetch("https://zoff.me/api/list/summér", {
      method: "POST"
    });
    const playlist = await request.json();
    if (this.playlist.error == true) {
      console.error(this.playlist.error);
      return;
    }
    this.playlist = playlist.results;
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
      perPage: 10,
      playlist: []
    };
  }
};
</script>

<style scoped lang="scss">
.song-container {
  display: flex;
  flex-direction: row;
  & .song {
    width: 75%;
  }
  & .song-context-button {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.pagination-buttons {
  display: flex;
  justify-content: space-between;

  & button {
    width: 35%;
    height: 30px;

    &.first,
    &.last {
      width: 10%;
    }
  }
}
</style>