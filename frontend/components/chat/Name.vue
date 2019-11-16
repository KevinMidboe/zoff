<template>
  <div class="name">
    <div class="icon-container" v-if="icon != undefined">
      <img :src="icon" />
    </div>
    <div class="name-container">{{ name }}</div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    }
  }
};
</script>

<style scoped lang="scss">
.name {
  display: flex;
  align-items: center;

  img {
    height: 10px;
    width: 10px;
    padding: 0 5px;
  }

  .name-container {
    padding: 0 5px 0 5px;
    color: orange;
  }
}
</style>