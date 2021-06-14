import urls from '@/store/urls';
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
    async DELETE_USER({ commit, rootState }) {
      try {
        commit('SET_FETCHING', true);
        const res = await api.delete(urls.concreteUser.replace(':id', rootState.user.id));
        console.log(res);
        commit('SET_USER_DATA', {}, { root: true });
        commit('SET_AUTHENTICATE', false, { root: true });
        return res;
      } finally {
        commit('SET_FETCHING', false);
      }
    },

    async UPDATE_USER({ commit, rootState }, { data }) {
      try {
        commit('SET_FETCHING', true);

        const res = await api.patch(urls.concreteUser.replace(':id', rootState.user.id), data);
        commit('SET_USER_DATA', res.data, { root: true });
        return res;
      } finally {
        commit('SET_FETCHING', false);
      }
    },
  },
};
