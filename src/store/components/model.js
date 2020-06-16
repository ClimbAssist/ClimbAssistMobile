const state = () => ({
  loadedModels: []
});
const getters = {};
const mutations = {
  updateLoadedModels: (state, payload) => {
    state.loadedModels.push(payload);
  }
};
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};