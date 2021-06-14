import urls from '@/store/urls';
import api from '@/assets/utils/api';

export default {
  async GET_USER({ commit }, id) {
    try {
      commit('SET_FETCHING', true);
      const res = await api.get(urls.concreteUser.replace(':id', id));
      commit('SET_USER', res.data);
      return res;
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async GET_POSTS({ commit }, id) {
    try {
      commit('SET_FETCHING', true);
      const res = await api.get(urls.posts.replace(':id', id));
      commit('SET_POSTS', res.data);
      return res;
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async TOGGLE_LIKE({ commit }, id) {
    try {
      commit('SET_FETCHING', true);
      const res = await api.get(urls.toggleLike.replace(':id', id));
      commit('SET_LIKES', { postId: id, likes: res.data });
      return res;
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async ADD_POST({ commit, rootState }, text) {
    try {
      commit('SET_FETCHING', true);
      const res = await api.post(urls.posts.replace(':id', rootState.user.id), {
        text,
      });
      commit('ADD_POST', { text, likes: [], user: rootState.user, id: res.data.id });
      return res;
    } catch (e) {
      alert(e);
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async GET_COMMENTS({ commit, state }, id) {
    try {
      commit('SET_FETCHING', true);
      const res = await api.get(
        urls.comments
          .replace(':user_id', state.user.id)
          .replace(':post_id', id),
      );
      commit('SET_COMMENTS', { postId: id, comments: res.data });
      return res;
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async ADD_COMMENT({ commit, rootState }, { id, text }) {
    try {
      commit('SET_FETCHING', true);
      const res = await api.post(
        urls.comments
          .replace(':user_id', rootState.user.id)
          .replace(':post_id', id),
        {
          text,
        },
      );
      commit('ADD_COMMENT', { postId: id, comment: { text, user: rootState.user, id: res.data.id }});
      return res;
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async DELETE_POST({ commit, rootState }, postId) {
    try {
      commit('SET_FETCHING', true);
      const res = await api.delete(
        urls.concretePost
          .replace(':user_id', rootState.user.id)
          .replace(':post_id', postId),
      );
      commit('DELETE_POST', postId);
      return res;
    } catch (e) {
      alert(e);
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async EDIT_POST({ commit, rootState }, { postId, text }) {
    try {
      commit('SET_FETCHING', true);
      const res = await api.patch(
        urls.concretePost
          .replace(':user_id', rootState.user.id)
          .replace(':post_id', postId),
        {
          text,
        },
      );
      commit('UPDATE_POST', { postId, text });
      return res;
    } catch (e) {
      alert(e);
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async DELETE_COMMENT({ commit, rootState }, commentId) {
    try {
      commit('SET_FETCHING', true);
      const res = await api.delete(
        urls.concreteComment
          .replace(':user_id', rootState.user.id)
          .replace(':comment_id', commentId),
      );
      commit('DELETE_COMMENT', commentId);
      return res;
    } catch (e) {
      alert(e);
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async EDIT_COMMENT({ commit, rootState }, { commentId, text }) {
    try {
      commit('SET_FETCHING', true);
      const res = await api.patch(
        urls.concreteComment
          .replace(':user_id', rootState.user.id)
          .replace(':comment_id', commentId),
        {
          text,
        },
      );
      commit('UPDATE_COMMENT', { commentId, text });
      return res;
    } catch (e) {
      alert(e);
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async TOGGLE_SUBSCRIBE({ commit, state, rootState }, status) {
    try {
      commit('SET_FETCHING', true);
      const url = status ? urls.subscribe : urls.unsubscribe;
      const res = await api.get(url.replace(':id', state.user.id));
      commit('TOGGLE_SUBSCRIBE', { status, user: rootState.user });
      return res;
    } catch (error) {
      alert(error);
    } finally {
      commit('SET_FETCHING', false);
    }
  },

  async CREATE_CHAT({ commit, state }) {
    try {
      commit('SET_FETCHING', true);
      return await api.post(urls.createChat, { users: [state.user.id] });
    } catch (error) {
      alert(error);
    } finally {
      commit('SET_FETCHING', false);
    }
  },
};
