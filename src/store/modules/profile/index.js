import mutations from '@/store/modules/profile/mutations';
import actions from '@/store/modules/profile/actions';

export default {
  namespaced: true,

  state: () => ({
    fetching: false,
    user: {
      username: '',
      id: 0,
      following: [],
      subscribers: [],
    },
    posts: [],
  }),
  getters: {
    username(state) {
      return state.user.username;
    },
    isCurrentUserProfile(state, getters, rootState) {
      return rootState.user.id === state.user.id;
    },
  },
  mutations,
  actions,
};
