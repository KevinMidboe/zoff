export default {
  namespaced: true,
  state: {
    player: undefined
  },
  getters: {
    player: (state) => {
      return state.player;
    }
  },
  mutations: {
    SET_PLAYER: (state, player) => {
      state.player = player;
    }
  },
  actios: {
    setPlayer({ commit }, player) {
      commit('SET_PLAYER', player)
    }
  }
}
