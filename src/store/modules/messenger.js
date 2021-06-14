import urls from '@/store/urls';
import api from '@/assets/utils/api';

export default {
  namespaced: true,

  state: () => ({
    fetching: false,
    chats: [],
  }),

  getters: {
    currentChat(state, getters, rootState) {
      return state.chats.find(({ id }) => id === rootState.route.query.sel);
    },
  },

  mutations: {
    SET_FETCHING(state, status) {
      state.fetching = status;
    },

    UPDATE_CHAT_UNREAD(state, { chatId, unread }) {
      const chatIdx = state.chats.findIndex(chat => chat.id === chatId);

      if (~chatIdx) {
        state.chats.splice(chatIdx, 1, {
          ...state.chats[chatIdx],
          unread,
        });
      }
    },

    SET_CHAT_HISTORY(state, chat) {
      // TODO выпилить к херам и сделать нормально
      if (state.chats.length) {
        const chatIdx = state.chats.findIndex(el => el.id === chat.id);
        if (~chatIdx) {
          state.chats.splice(chatIdx, 1, chat);
        }
      } else {
        state.chats.push(chat);
      }
    },

    ADD_MESSAGE(state, message) {
      const chatIdx = state.chats.findIndex(el => el.id === message.chat);
      if (~chatIdx) {
        const messageIdx = state.chats[chatIdx].messages.findIndex(msg => msg.id === message.id);
        if (!~messageIdx) {
          state.chats[chatIdx].messages.push(message);
        }
      }
    },

    SET_CHATS(state, chats) {
      // TODO выпилить к херам и сделать нормально
      if (!state.chats.length) {
        state.chats = chats;
      } else {
        const chatIdx = chats.findIndex(el => el.id === state.chats[0].id);
        if (~chatIdx) {
          chats.splice(chatIdx, 1, state.chats[0]);
        }
        state.chats = chats;
      }
    },
  },

  actions: {
    async LOAD_CHAT_HISTORY({ commit }, chat) {
      try {
        commit('SET_FETCHING', true);
        const res = await api.get(urls.getChat.replace(':id', chat));
        commit('SET_CHAT_HISTORY', res.data);
        return res;
      } finally {
        commit('SET_FETCHING', false);
      }
    },

    async GET_CHATS({ commit }) {
      try {
        commit('SET_FETCHING', true);
        const res = await api.get(urls.getChats);
        commit('SET_CHATS', res.data);
        return res;
      } catch (error) {
        alert(error);
      } finally {
        commit('SET_FETCHING', false);
      }
    },
  },
};
