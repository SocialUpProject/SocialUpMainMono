<template>
  <v-card
    :class="$s.messagesContainer"
    class="d-flex flex-column">
    <v-card
      tile
      outlined
      color="yellow lighten-1"
      class="flex-grow-0 py-1 px-2">
      <v-card-title class="justify-space-between pa-0">
        <v-btn
          icon
          @click="$router.replace({query:{}})">
          <v-icon>
            mdi-arrow-left
          </v-icon>
        </v-btn>
        <h3 class="font-weight-regular">
          {{ getChatUsersNamesExceptCurrent.join(', ') }}
        </h3>
        <div />
      </v-card-title>
    </v-card>
    <div
      v-if="messages.length"
      :id="$s.messages"
      class="flex-grow-1">
      <v-card-text
        v-for="message in messages"
        :key="message.id"
        class="pa-0">
        <v-list-item>
          <v-list-item-avatar color="primary">
            <v-img
              v-if="getUserById(message.user).avatar"
              :src="getUserById(message.user).avatar" />
            <span
              v-else
              class="white--text headline">
              {{ getUserById(message.user).username[0] }}
            </span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="grey--text">
              {{ getUserById(message.user).username }}
            </v-list-item-title>
            <v-list-item-subtitle class="black--text">
              {{ message.text }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </div>
    <div
      v-else
      class="d-flex flex-column justify-center align-center flex-grow-1">
      <span>
        Пока нет сообщений
      </span>
    </div>
    <v-card-actions class="align-center justify-center">
      <v-textarea
        v-model="messageText"
        placeholder="Введите сообщение"
        outlined
        rows="1"
        hide-details
        no-resize
        row-height="15"
        class="mr-2"
        @keyup.enter.exact="sendMessage" />
      <v-btn
        dense
        color="yellow darken-1"
        icon
        @click="sendMessage">
        <v-icon>
          mdi-send
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import { sendMessage, readAllMessages, socket, readMessage } from 'assets/socketio-client';

export default {
  name: 'Chat',

  data() {
    return {
      messageText: '',
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters('messenger', [
      'currentChat',
    ]),

    selectedChat() {
      return this.$route.query.sel;
    },

    messages() {
      return this.currentChat?.messages || [];
    },

    getChatUsersNamesExceptCurrent() {
      return this.getChatUsersIdsExceptCurrent.map(id => this.getUserById(id).username);
    },

    getChatUsersIdsExceptCurrent() {
      return this.currentChat?.users?.reduce((prev, { id }) => {
        if (id !== this.user.id) {
          prev.push(id);
        }
        return prev;
      }, []) || [];
    },
  },

  watch: {
    selectedChat: {
      immediate: true,
      handler() {
        this.initializeChat();
      },
    },
  },

  mounted() {
    this.scrollBottom();
  },

  methods: {

    ...mapActions('messenger', {
      getChat: 'LOAD_CHAT_HISTORY',
    }),

    getUserById(id) {
      const user = this.currentChat.users.find(user => user.id === id);
      if (user) {
        return user;
      } else {
        const err = new Error();
        err.message = 'No user found';
        throw err;
      }
    },

    async initializeChat() {
      try {
        await this.getChat(this.selectedChat);
        await this.scrollBottom();
        readAllMessages({
          chat: this.selectedChat,
          users: this.getChatUsersIdsExceptCurrent,
        });
        socket.on('getMessage', async data => {
          if (data.user !== this.user.id && data.chat === this.selectedChat) {
            readMessage(data.id);
          }
          await this.scrollBottom();
        });
      } catch (e) {
        await this.$router.push({ name: 'Messenger' });
      }
    },

    async scrollBottom() {
      await this.$nextTick();
      const objDiv = document.getElementById(this.$s.messages);
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    },

    sendMessage() {
      if (this.messageText) {
        sendMessage({
          chat: this.selectedChat,
          from: this.user,
          text: this.messageText,
        });
        this.messageText = '';
      }
    },
  },
};
</script>

<style lang="sass" module="$s">
.messagesContainer
  height: calc(100vh - 100px)
#messages
  overflow-y: auto
</style>
