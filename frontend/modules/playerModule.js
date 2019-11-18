
export default {
  namespaced: true,
  state: {
    player: undefined,
    playlist: [],
    authenticatedAdmin: false,
    channelSettings: null,
    clientSettings: null,
    nowPlaying: null,
    userSuggested: [],
    externalSuggested: [],
    PLAYER_STATES: {
      BUFFERING: 3,
      CUED: 5,
      ENDED: 0,
      PAUSED: 2,
      PLAYING: 1,
      UNSTARTED: -1
    },
    socket: null,
    channel: "summér"
  },
  getters: {
    channel: state => {
      return state.channel;
    },
    socket: state => {
      return state.socket
    },
    PLAYER_STATES: state => {
      return state.PLAYER_STATES;
    },
    authenticatedAdmin: state => {
      return state.authenticatedAdmin;
    },
    playlist: state => {
      return state.playlist;
    },
    channelSettings: state => {
      return state.channelSettings;
    },
    clientSettings: state => {
      return state.clientSettings;
    },
    nowPlaying: state => {
      return state.nowPlaying;
    },
    userSuggested: state => {
      return state.userSuggested;
    },
    externalSuggested: state => {
      return state.externalSuggested;
    },
    player: state => {
      return state.player;
    }
  },
  mutations: {
    SET_CHANNEL: (state, channel) => {
      state.channel = channel;
    },
    SET_AUTHENTICATED_ADMIN: (state, authenticatedAdmin) => {
      state.authenticatedAdmin = authenticatedAdmin;
    },
    SET_PLAYLIST: (state, playlist) => {
      state.playlist = playlist;
    },
    SET_CHANNEL_SETTINGS: (state, channelSettings) => {
      state.channelSettings = channelSettings;
    },
    SET_CLIENT_SETTINGS: (state, clientSettings) => {
      state.clientSettings = clientSettings;
    },
    SET_NOW_PLAYING: (state, nowPlaying) => {
      state.nowPlaying = nowPlaying;
    },
    SET_USER_SUGGESTED: (state, userSuggested) => {
      state.userSuggested = userSuggested;
    },
    SET_EXTERNAL_SUGGESTED: (state, externalSuggested) => {
      state.externalSuggested = externalSuggested;
    },
    SET_PLAYER: (state, player) => {
      state.player = player;
    }
  },
  actions: {
    setChannel({ commit }, channel) {
      commit("SET_CHANNEL", channel.toLowerCase());
    },
    setAuthenticatedAdmin({ commit }, authenticatedAdmin) {
      commit("SET_AUTHENTICATED_ADMIN", authenticatedAdmin);
    },
    setPlaylist({ commit }, playlist) {
      commit("SET_PLAYLIST", playlist);
    },
    setChannelSettings({ commit }, channelSettings) {
      commit("SET_CHANNEL_SETTINGS", channelSettings);
    },
    setClientSettings({ commit }, clientSettings) {
      commit("SET_CLIENT_SETTINGS", clientSettings);
    },
    setNowPlaying({ commit }, nowPlaying) {
      commit("SET_NOW_PLAYING", nowPlaying);
    },
    setUserSuggested({ commit }, userSuggested) {
      commit("SET_USER_SUGGESTED", userSuggested);
    },
    setExternalSuggested({ commit }, externalSuggested) {
      commit("SET_EXTERNAL_SUGGESTED", externalSuggested);
    },
    setPlayer({ commit }, player) {
      commit("SET_PLAYER", player);
    }
  }
};
