<template>
  <v-row>
    <v-col cols="9">
      <v-text-field v-model="chatInput" label="Aa.." @keyup.enter="send"></v-text-field>
    </v-col>
    <v-col cols="1">
      <v-btn @click="send">Send</v-btn>
    </v-col>
    <v-col cols="1">
      <v-btn @click="requestHelp">Help</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      chatInput: ""
    };
  },
  methods: {
    send: function() {
      if (this.chatInput == "") {
        return;
      }
      this.$emit("sentMessage", this.chatInput);
      this.chatInput = "";
    },
    requestHelp: function() {
      console.log("emit for help here");
    }
  }
};
</script>

<style scoped lang="scss">
</style>