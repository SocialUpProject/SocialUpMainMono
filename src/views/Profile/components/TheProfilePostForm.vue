<template>
  <v-card
    v-if="isCurrentUserProfile"
    class="mb-2">
    <v-card-text class="pb-0">
      <v-text-field
        v-model="postContent"
        label="Что нового?"
        hint="Расскажите о последних событиях"
        @keyup.enter="addPost" />
    </v-card-text>
    <v-card-actions class="pt-0">
      <v-list-item class="grow">
        <v-row
          align="center"
          justify="start">
          <v-btn
            color="primary"
            :disabled="!postContent || fetching"
            @click="addPost">
            Поделиться
          </v-btn>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'TheProfilePostForm',
  data() {
    return {
      postContent: '',
    };
  },
  computed: {
    ...mapState('profile', ['fetching']),
    ...mapGetters('profile', ['isCurrentUserProfile']),
  },
  methods: {
    ...mapActions('profile', {
      sendPost: 'ADD_POST',
    }),
    async addPost() {
      if (!this.postContent) return;
      try {
        await this.sendPost(this.postContent);
        this.postContent = '';
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
