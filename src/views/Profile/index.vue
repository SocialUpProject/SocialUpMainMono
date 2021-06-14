<template>
  <v-row justify="center">
    <v-col
      lg="4"
      md="4"
      sm="12"
      xs="12"
      class="pr-lg-0 pr-md-0">
      <the-profile-title v-if="!fetching" />
      <v-skeleton-loader
        v-else
        type="card"
        elevation="1" />
    </v-col>
    <v-col>
      <the-profile-post-form v-if="!fetching" />
      <template v-if="!fetching">
        <profile-post
          v-for="post in posts"
          :key="post.id"
          :post="post" />
      </template>
      <template v-else>
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          class="mb-2"
          type="article"
          elevation="1" />
      </template>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import TheProfileTitle from '@/views/Profile/components/TheProfileTitle';
import TheProfilePostForm from '@/views/Profile/components/TheProfilePostForm';
import ProfilePost from '@/views/Profile/components/ProfilePost';

export default {
  name: 'Profile',
  components: {
    TheProfileTitle,
    TheProfilePostForm,
    ProfilePost,
  },
  data() {
    return {
      postContent: '',
      postComments: {},
      editing: '',
      editingContent: '',
      fetching: false,
    };
  },

  computed: {
    ...mapState('profile', ['posts']),
  },

  watch: {
    '$route.params.id'() {
      this.loadUserData();
    },
  },

  created() {
    this.loadUserData();
  },

  methods: {
    ...mapActions('profile', {
      getUser: 'GET_USER',
      getPosts: 'GET_POSTS',
    }),

    async loadUserData() {
      this.fetching = true;
      await Promise.all([
        this.getUser(this.$route.params.id),
        this.getPosts(this.$route.params.id),
      ]);
      this.fetching = false;
    },

  },
};
</script>
