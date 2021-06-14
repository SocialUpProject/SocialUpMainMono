import urls from '@/store/urls';
import api from '@/assets/utils/api';

export default {
  namespaced: true,

  state: () => ({
    fetching: false,
    users: {},
  }),

  mutations: {
    SET_FETCHING(state, status) {
      state.fetching = status;
    },

    SET_USERS(state, users) {
      state.users = users;
    },
  },

  actions: {
    async GET_USERS({ commit }, query) {
      try {
        commit('SET_FETCHING', true);
        const res = await api.get(urls.users, {
          params: { ...query },
        });
        commit('SET_USERS', res.data);
        return res;
      } finally {
        commit('SET_FETCHING', false);
      }
    },
  },
};
