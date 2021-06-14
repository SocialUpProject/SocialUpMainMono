<template>
  <v-row
    justify="start">
    <v-col v-if="!selectedChat">
      <v-card color="yellow lighten-1">
        <v-list v-if="mappedChats.length && !fetching">
          <v-list-item
            v-for="(chat) in mappedChats"
            :key="chat.id"
            @click="$router.replace({ query: { sel: chat.id }})">
            <v-badge
              :content="chat.unread || 0"
              :value="chat.unread || 0"
              color="blue"
              overlap>
              <v-list-item-avatar
                color="primary"
                class="ma-0">
                <v-img
                  v-if="chat.user.avatar"
                  :src="chat.user.avatar" />
                <span
                  v-else
                  class="white--text headline">
                  {{ chat.user.username[0] }}
                </span>
              </v-list-item-avatar>
            </v-badge>
            <v-list-item-content class="ml-3">
              {{ chat.user.username }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list v-else-if="fetching">
          <v-skeleton-loader
            v-for="i in 4"
            :key="i"
            type="list-item-avatar" />
        </v-list>
        <div v-else>
          У вас пока нет диалогов
        </div>
      </v-card>
    </v-col>
    <v-col v-else>
      <the-messenger-chat />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { socket } from 'assets/socketio-client';
import TheMessengerChat from '@/views/Messenger/components/TheMessengerChat';

export default {
  name: 'Messenger',

  components: {
    TheMessengerChat,
  },

  data() {
    return {
      fetching: false,
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapState('messenger', ['chats']),

    selectedChat() {
      return this.$route.query.sel;
    },

    unread() {
      return this.chats.reduce((prev, { id, unread }) => {
        prev[id] = unread;
        return prev;
      }, {});
    },

    mappedChats() {
      return this.chats.map(({ id, users, unread }) => ({
        id,
        unread,
        user: users.find(user => user.id !== this.user.id),
      }));
    },
  },

  async created() {
    this.fetching = true;
    await this.loadChats();
    socket.on('getMessage', data => {
      this.addMessage(data);
    });
    socket.on('newMessageInChat', async data => {
      console.log(data);
      this.updateChatUnread({
        chatId: data.chat,
        unread: data.unread,
      });
    });
    this.fetching = false;
  },

  methods: {
    ...mapActions('messenger', {
      loadChats: 'GET_CHATS',
    }),
    ...mapMutations('messenger', {
      addMessage: 'ADD_MESSAGE',
      updateChatUnread: 'UPDATE_CHAT_UNREAD',
    }),
  },
};
</script>
