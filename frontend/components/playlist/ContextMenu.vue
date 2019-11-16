<template>
  <div class="context-menu-container" :style="'top:' + mouseY + 'px;left:' + mouseX + 'px;'">
    <ul>
      <li>Copy link</li>
      <li>Find similar</li>
      <li>Added by {{ addedBy }}</li>
      <hr />
      <li>Delete</li>
    </ul>
    <div class="context-menu-background" @mouseout="closeSelf" @click="closeSelf"></div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    },
    addedBy: {
      required: true,
      type: String
    },
    mouseX: {
      required: true,
      type: Number
    },
    mouseY: {
      required: true,
      type: Number
    }
  },
  methods: {
    closeSelf: function(e) {
      if (e.toElement == null || e.toElement.nodeName == null) {
        return;
      }
      if (e.toElement.nodeName == "UL" || e.toElement.nodeName == "LI") {
        return;
      }
      this.$emit("closeContextMenu");
    }
  }
};
</script>

<style scoped lang="scss">
.context-menu-background {
  background: #000000a0;
  width: 500px;
  height: 500px;
  position: absolute;
  left: -85%;
  top: -100%;
  z-index: 1;
}
.context-menu-container {
  font-family: sans-serif;

  position: absolute;
  background-color: #2d2d2d;
  border-radius: 10px;
  color: white;

  & ul {
    z-index: 2;
    list-style: none;
    padding: 10px 0 10px 0;
    margin: 0;
    position: relative;
    background-color: #2d2d2d;
    border-radius: 10px;
    color: white;

    & li {
      cursor: pointer;
      padding: 5px 15px;

      &:hover {
        background-color: #ffffff15;
      }
    }

    & hr {
      padding: 0px;
      margin: 0;
    }
  }
}
</style>