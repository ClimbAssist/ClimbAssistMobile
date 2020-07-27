import Vue from 'vue';
import Vuex from 'vuex';
import filter from './components/filter';
import frame from './components/frame';
import snackbar from './components/snackbar';
import model from './components/model';
import user from './components/user';
import sidebar from './components/sidebar';
import area from './components/area';
import dialog from './components/dialog';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    filter,
    frame,
    model,
    snackbar,
    user,
    sidebar,
    area,
    dialog,
  },
});
