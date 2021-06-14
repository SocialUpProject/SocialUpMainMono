<template>
  <v-card>
    <v-img
      :src="user.profile_header"
      :class="$s.header"
      class="white--text align-end"
      height="200px">
      <v-card-title>
        <v-list-item
          class="grow px-0">
          <v-list-item-avatar
            color="primary"
            size="100"
            elevation="6">
            <v-img
              v-if="user.avatar"
              :src="user.avatar" />
            <span
              v-else
              class="white--text headline">
              {{ user.username[0] }}
            </span>
          </v-list-item-avatar>

          <v-list-item-title class="white--text">
            {{ user.username }}
            <v-btn
              v-if="!isCurrentUserProfile"
              text
              icon
              color="white"
              @click="toggleSubscribe(!isUserSubscribe)">
              <v-icon>
                {{ getIcon }}
              </v-icon>
            </v-btn>
            <v-btn
              v-if="!isCurrentUserProfile"
              text
              icon
              color="white"
              @click="toChat(user.chat)">
              <v-icon>
                mdi-message
              </v-icon>
            </v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-card-title>
    </v-img>
    <v-divider />
    <v-card-actions class="layout flex justify-space-between pa-0">
      <v-list-item
        id="followers-modal-activator"
        link
        class="text-center"
        @click="followersModalShow = true">
        <v-list-item-content>
          <v-list-item-title>
            Подписчики
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.subscribers.length }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <followers-modal
        v-model="followersModalShow"
        type="subscribers"
        activator="#followers-modal-activator"
        :user="user" />
      <v-divider vertical />
      <v-list-item
        id="following-modal-activator"
        link
        class="text-center"
        @click="followingModalShow = true">
        <v-list-item-content>
          <v-list-item-title>
            Подписан
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.following.length }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <followers-modal
        v-model="followingModalShow"
        type="following"
        activator="#following-modal-activator"
        :user="user" />
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import FollowersModal from '@/views/Profile/modals/FollowersModal';

export default {
  name: 'ProfileTitle',
  components: {
    FollowersModal,
  },
  data() {
    return {
      followersModalShow: false,
      followingModalShow: false,
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    ...mapState('profile', ['user', 'fetching']),
    ...mapGetters('profile', ['isCurrentUserProfile']),
    isUserSubscribe() {
      return !!this.user.subscribers.find(user => user.id === this.currentUser.id);
    },
    getIcon() {
      return this.isUserSubscribe
        ? 'mdi-account-check'
        : 'mdi-account-plus';
    },
  },
  watch: {
    '$route.params.id'() {
      this.followingModalShow = false;
      this.followersModalShow = false;
    },
  },
  methods: {
    ...mapActions('profile', {
      toggleSubscribe: 'TOGGLE_SUBSCRIBE',
      createChat: 'CREATE_CHAT',
    }),

    async toChat(chat) {
      if (chat) {
        await this.$router.push({ name: 'Messenger', query: { sel: chat }});
      } else {
        const res = await this.createChat();
        console.log(res);
        await this.$router.push({ name: 'Messenger', query: { sel: res.data.id }});
      }
    },
  },
};
</script>

<style module="$s" lang="sass">
.header
  background: #546e7a!important
</style>
