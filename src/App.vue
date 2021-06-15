<template>
  <v-app>
    <v-app-bar
      color="yellow lighten-1"
      app
      clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="'Social up!'" />
      <v-spacer />

      <router-view name="header" />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      color="yellow lighten-5"
      fixed
      temporary>
      <template v-if="!fetching">
        <template v-if="isAuthenticate">
          <v-list-item
            two-line
            class="px-2">
            <v-list-item-avatar color="primary">
              <v-img
                v-if="user.avatar"
                :src="user.avatar" />
              <span
                v-else
                class="white--text headline">
                {{ user.username[0] }}
              </span>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.username }} </v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider />

          <v-list dense>
            <v-list-item
              v-for="route in authRoutes"
              :key="route.title"
              link
              :to="route.to">
              <v-list-item-icon>
                <v-badge
                  v-if="route.badge"
                  v-bind="route.badge">
                  <v-icon>{{ route.icon }}</v-icon>
                </v-badge>
                <v-icon v-else>
                  {{ route.icon }}
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ route.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              link
              @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Выйти</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>
        <template v-else>
          <v-list dense>
            <v-list-item
              v-for="route in noAuthRoutes"
              :key="route.title"
              link
              :to="route.to">
              <v-list-item-icon>
                <v-icon>{{ route.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ route.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>
      </template>
      <template v-else>
        <v-skeleton-loader type="list-item-avatar-two-line" />
        <v-list dense>
          <v-skeleton-loader
            v-for="i in 3"
            :key="i"
            type="list-item" />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app />
  </v-app>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { socket } from 'assets/socketio-client';

export default {
  name: 'App',

  components: {
  },

  data() {
    return {
      drawer: false,
    };
  },

  computed: {
    ...mapState(['user', 'isAuthenticate', 'fetching']),

    messagesCount() {
      return this.user.messages_count;
    },

    authRoutes() {
      return [
        {
          icon: 'mdi-account',
          title: 'Аккаунт',
          to: { name: 'Profile', params: { id: this.user?.id }},
        },
        {
          icon: 'mdi-account-group-outline',
          title: 'Сообщество',
          to: { name: 'People' },
        },
        {
          icon: 'mdi-message',
          title: 'Мессенджер',
          to: { name: 'Messenger' },
          badge: {
            content: this.messagesCount || 0,
            value: this.messagesCount || 0,
            color: 'blue',
            overlap: true,
          },
        },
        {
          icon: 'mdi-cog',
          title: 'Настройки',
          to: { name: 'Settings' },
        },
      ];
    },

    noAuthRoutes() {
      return [
        {
          icon: 'mdi-account',
          title: 'Войти',
          to: { name: 'Login' },
        },
        {
          icon: 'mdi-account-group-outline',
          title: 'Зарегестрироваться',
          to: { name: 'Register' },
        },
      ];
    },
  },

  created() {
    socket.on('newMessage', count => {
      this.setUnreadMessagesCount(count);
    });
  },

  methods: {
    ...mapMutations({
      setUnreadMessagesCount: 'SET_UNREAD_MESSAGES_COUNT',
    }),
    ...mapActions({
      logoutRequest: 'LOGOUT',
    }),

    async logout() {
      const answer = confirm('Вы действительно хотите выйти?');
      if (answer) {
        socket.disconnect();
        await this.logoutRequest();
        await this.$router.push({ name: 'Login' });
      }
    },
  },
};
</script>
