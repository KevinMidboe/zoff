import Vue from "vue";
import Vuex from "vuex";

import playerModule from "@/modules/playerModule";
import socketModule from "@/modules/socketModule";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    playerModule,
    socketModule
  }
});

export default store;
