const state = () => ({
  open: false,
  title: 'Welcome to Climb Assist',
  text: 'Please Login or create an account to continue',
  component: undefined,
  switchText: 'Create Account',
});
const getters = {};
const mutations = {
  updateDialogOpen: (state, payload) => {
    state.open = payload;
  },
  updateDialogTitle: (state, payload) => {
    state.title = payload;
  },
  updateDialogText: (state, payload) => {
    state.text = payload;
  },
  updateDialogComponent: (state, payload) => {
    state.component = payload;
  },
  updateDialogSwitchText: (state, payload) => {
    state.switchText = payload;
  },
};
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
