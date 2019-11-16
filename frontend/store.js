import Vue from 'vue';
import Vuex from 'vuex';

import playerModule from '@/modules/playerModule';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    playerModule
  }
})