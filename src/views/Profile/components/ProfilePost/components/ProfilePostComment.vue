<template>
  <v-card
    class="mb-2"
    outlined>
    <v-card-title class="px-0 py-1">
      <v-list-item
        :link="comment.user.id !== user.id"
        :inactive="comment.user.id === user.id"
        :to="{ name: 'Profile', params: { id: comment.user.id }}">
        <v-list-item-avatar
          color="primary"
          elevation="6">
          <v-img
            v-if="comment.user.avatar"
            :src="comment.user.avatar" />
          <span
            v-else
            class="white--text headline">
            {{ comment.user.username[0] }}
          </span>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ comment.user.username }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-row
      align="center"
      justify="start">
      <v-col>
        <v-card-text v-if="editing !== comment.id">
          {{ comment.text }}
        </v-card-text>
        <template v-else>
          <v-card-text class="py-0">
            <v-text-field
              v-model="editingContent"
              label="Редактировать комментарий"
              @keyup.enter="editComment(comment)" />
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn
              color="primary"
              :disabled="!editingContent || editingContent === comment.text"
              @click="editComment(comment)">
              Редактировать
            </v-btn>
          </v-card-actions>
        </template>
      </v-col>
      <v-col
        v-if="currentUser.id === comment.user.id"
        class="layout flex justify-end"
        cols="2">
        <v-btn
          text
          icon
          @click="enableEditMode(comment)">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn
          text
          icon
          @click="deleteComment(comment.id)">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editing: '',
      editingContent: '',
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    ...mapState('profile', ['user', 'fetching']),
  },
  methods: {
    ...mapActions('profile', {
      sendDeleteCommentRequest: 'DELETE_COMMENT',
      sendEditComment: 'EDIT_COMMENT',
    }),

    deleteComment(commentId) {
      const ans = confirm('Удалить комментарий?');
      if (!ans) return;
      this.sendDeleteCommentRequest(commentId);
    },

    async editComment(comment) {
      if (!this.editingContent || this.editingContent === comment.text) return;
      try {
        await this.sendEditComment({ commentId: comment.id, text: this.editingContent });
        this.editing = '';
        this.editingContent = '';
      } catch (e) {
        console.error(e);
      }
    },

    enableEditMode(entity) {
      this.editing = this.editing === entity.id ? '' : entity.id;
      if (this.editing) {
        this.editingContent = entity.text;
      }
    },
  },
};
</script>

<style scoped>

</style>
