import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
import urls from '@/store/urls';
import cookie from 'js-cookie';
import api from '@/assets/utils/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    user: {
      username: '',
      email: '',
      messages_count: 0,
    },
    fetching: false,
    isAuthenticate: null,
  }),

  getters: {
    currentUsersId(state) {
      return state.user.id;
    },
  },

  mutations: {
    SET_FETCHING(state, status) {
      state.fetching = status;
    },
    SET_USER_DATA(state, user) {
      state.user = user;
    },
    SET_UNREAD_MESSAGES_COUNT(state, count) {
      state.user.messages_count = count;
    },
    SET_AUTHENTICATE(state, value) {
      state.isAuthenticate = value;
    },
  },

  actions: {
    async GET_CURRENT_USER({ commit }) {
      try {
        commit('SET_FETCHING', true);
        const res = await api.get(urls.currentUser);
        commit('SET_USER_DATA', res.data);
        commit('SET_AUTHENTICATE', true);
        return res;
      } catch (error) {
        commit('SET_AUTHENTICATE', false);
      } finally {
        commit('SET_FETCHING', false);
      }
    },

    async LOGOUT({ commit }) {
      try {
        commit('SET_FETCHING', true);
        await api.post(urls.logout);
        commit('SET_USER_DATA', {
          username: '',
          email: '',
        });
        cookie.remove('access_token');
        cookie.remove('refresh_token');
        delete api.defaults.headers.common.Authorization;
        commit('SET_AUTHENTICATE', false);
      } finally {
        commit('SET_FETCHING', false);
      }
    },
  },
  modules,
});
