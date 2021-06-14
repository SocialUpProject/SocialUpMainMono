import urls from '@/store/urls';
import cookie from 'js-cookie';
import api from '@/assets/utils/api';

export default {
  namespaced: true,

  state: () => ({
    fetching: false,
  }),

  mutations: {
    SET_FETCHING(state, status) {
      state.fetching = status;
    },
  },

  actions: {
    async LOGIN_TO_ACCOUNT({ commit }, data) {
      try {
        commit('SET_FETCHING', true);
        const res = await api.post(urls.login, data);
        cookie.set('access_token', res.data.access_token);
        cookie.set('refresh_token', res.data.refresh_token);
        return res;
      } finally {
        commit('SET_FETCHING', false);
      }
    },
    async REGISTER_USER({ commit }, data) {
      try {
        commit('SET_FETCHING', true);
        return await api.post(urls.register, data);
      } finally {
        commit('SET_FETCHING', false);
      }
    },
  },
};
