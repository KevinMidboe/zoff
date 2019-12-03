export default {
  namespaced: true,
  state: {
    socket: null
  },
  getters: {
    socket: state => {
      return state.socket;
    }
  },
  mutations: {
    SET_SOCKET: (state, socket) => {
      state.socket = socket;
    }
  },
  actions: {
    setSocket({ commit }, socket) {
      commit("SET_SOCKET", socket);
    }
  }
};
