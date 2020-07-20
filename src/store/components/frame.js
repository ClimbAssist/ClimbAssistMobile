const state = () => ({
  frameTabs: null,
  activeRoute: null,
  downloaded: false,
});
const getters = {};
const mutations = {
  cragView: (state, payload) => {
    state.frameTabs = payload;
  },
  updateActiveRoute: (state, payload) => {
    state.activeRoute = payload;
  },
  setDownloaded: (state, payload) => {
    state.downloaded = payload;
  },
};
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
