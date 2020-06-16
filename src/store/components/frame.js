const state = () => ({
  frameTabs: null,
  activeRoute: null
});
const getters = {};
const mutations = {
  cragView: (state, payload) => {
    state.frameTabs = payload;
  },
  updateActiveRoute: (state, payload) => {
    state.activeRoute = payload;
  }
};
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
