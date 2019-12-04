import Vue from "vue";
import VueRouter from "vue-router";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import router from "./routes";
import store from "./store";
import * as io from "socket.io-client";
import VueSocketIO from "vue-socket.io";

import SortMixin from "@/mixins/SortMixin";
import App from "./App.vue";

Vue.mixin(SortMixin);
Vue.use(VueRouter);
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io("http://localhost:8080"),
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);

new Vue({
  sockets: {
    connect: function(msg) {
      console.log("connected");
      this.$socket.emit("list", {
        version: 6,
        channel: "summér"
      });
    },
    channel: function(msg) {
      console.log("channel-message", msg);
    },
    np: function(msg) {}
  },
  vuetify,
  el: "#app",
  router,
  store,
  components: { App },
  render: h => h(App)
});
