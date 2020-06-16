const state = () => ({
  areaTabs: null
});
const getters = {};
const mutations = {
  areaView: (state, payload) => {
    state.areaTabs = payload;
  }
};
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
