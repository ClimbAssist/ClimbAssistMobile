const state = {
  sidebar: "defaultV"
};
const getters = {};
const mutations = {
  updateSidebar: (state, payload) => {
    state.sidebar = payload;
  }
};
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
