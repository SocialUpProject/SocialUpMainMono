<template>
  <v-row>
    <v-col>
      <template v-if="users.length && !fetching">
        <v-card
          v-for="{ username, avatar, id } in users"
          :key="id"
          class="ma-2"
          link
          :to="{ name: 'Profile', params: { id } }">
          <v-card-title>
            <v-list-item>
              <v-list-item-avatar
                color="primary"
                elevation="6">
                <v-img
                  v-if="avatar"
                  :src="avatar" />
                <span
                  v-else
                  class="white--text headline">
                  {{ username[0] }}
                </span>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-title>
        </v-card>
      </template>
      <template v-else-if="fetching">
        <v-card
          v-for="i in 25"
          :key="i"
          class="ma-2"
          link
          to="#">
          <v-card-title>
            <v-list-item>
              <v-skeleton-loader
                type="list-item-avatar"
                :width="getRandomWidth()"
                class="pa-0" />
            </v-list-item>
          </v-card-title>
        </v-card>
      </template>
      <div
        v-else
        class="text-center pt-5">
        Не найдено
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { debounce } from 'lodash-es';

export default {
  name: 'People',

  data() {
    return {
      fetching: false,
    };
  },

  computed: {
    ...mapState('people', ['users']),
  },

  watch: {
    '$route.query.search': {
      immediate: true,
      handler(val) {
        this.loadUsers({ search: val });
      },
    },
  },

  methods: {
    ...mapActions('people', {
      getUsers: 'GET_USERS',
    }),

    getRandomWidth() {
      return 200 + ~~((Math.random() * 100) / 2);
    },

    loadUsers: debounce(async function (query) {
      this.fetching = true;
      await this.getUsers(query);
      this.fetching = false;
    }, 100),
  },
};
</script>
