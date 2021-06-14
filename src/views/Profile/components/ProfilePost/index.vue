<template>
  <v-card
    class="mb-2">
    <v-card-subtitle class="px-0">
      <v-list-item class="grow">
        <v-list-item-avatar
          color="primary"
          elevation="6">
          <v-img
            v-if="post.user.avatar"
            :src="post.user.avatar" />
          <span
            v-else
            class="white--text headline">
            {{ post.user.username[0] }}
          </span>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ post.user.username }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card-subtitle>
    <v-card-text
      v-if="editing !== post.id"
      class="text-body-1">
      {{ post.text }}
    </v-card-text>
    <template v-else>
      <v-card-text class="py-0">
        <v-text-field
          v-model="editingContent"
          label="Редактировать пост"
          @keyup.enter="editPost(post)" />
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-btn
          color="primary"
          :disabled="!editingContent || editingContent === post.text"
          @click="editPost(post)">
          Редактировать
        </v-btn>
      </v-card-actions>
    </template>
    <v-card-actions class="pt-0">
      <v-row
        align="center"
        justify="start">
        <v-col cols="2">
          <v-btn
            text
            icon
            :color="color(post)"
            @click="likePost(post.id)">
            <v-icon>
              mdi-heart
            </v-icon>
          </v-btn>
          <span class="subheading ml-2">
            {{ post.likes.length }}
          </span>
        </v-col>
        <v-col cols="2">
          <v-btn
            text
            icon
            color="blue darken-2"
            @click="toggleComments(post)">
            <v-icon>
              mdi-comment
            </v-icon>
          </v-btn>
          <span class="subheading ml-2">
            {{ post.comments_count }}
          </span>
        </v-col>
        <v-spacer />
        <v-col
          v-if="isCurrentUserProfile"
          class="layout flex justify-end"
          cols="2">
          <v-btn
            text
            icon
            @click="enableEditMode(post)">
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn
            text
            icon
            @click="deletePost(post.id)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
    <v-card-text
      v-if="post.comments">
      <template v-if="!fetching">
        <profile-post-comment
          v-for="comment in post.comments"
          :key="comment.id"
          :comment="comment" />
      </template>
      <template v-else>
        <v-skeleton-loader
          type="article"
          elevation="2" />
      </template>
      <v-text-field
        v-model="postComments[post.id]"
        label="Введите комментарий"
        @keyup.enter="addComment(post.id)" />
      <v-btn
        color="primary"
        :disabled="!postComments[post.id]"
        @click="addComment(post.id)">
        Отправить
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import ProfilePostComment from '@/views/Profile/components/ProfilePost/components/ProfilePostComment';

export default {
  name: 'ProfilePost',
  components: {
    ProfilePostComment,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      postComments: {},
      editing: '',
      editingContent: '',
      fetching: false,
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    ...mapGetters('profile', ['isCurrentUserProfile']),
  },
  methods: {
    ...mapActions('profile', {
      likePost: 'TOGGLE_LIKE',
      loadComments: 'GET_COMMENTS',
      sendComment: 'ADD_COMMENT',
      sendDeletePostRequest: 'DELETE_POST',
      sendEditPost: 'EDIT_POST',
    }),

    async addComment(postId) {
      if (!this.postComments[postId]) return;
      try {
        await this.sendComment({ id: postId, text: this.postComments[postId] });
        this.postComments[postId] = '';
      } catch (e) {
        console.error(e);
      }
    },

    color(post) {
      return post.likes.find(user => user.id === this.currentUser.id) ? 'red darken-2' : '';
    },

    async toggleComments(post) {
      if (post.comments) {
        this.$delete(post, 'comments');
      } else {
        this.fetching = true;
        await this.loadComments(post.id);
        this.fetching = false;
      }
    },

    enableEditMode(entity) {
      this.editing = this.editing === entity.id ? '' : entity.id;
      if (this.editing) {
        this.editingContent = entity.text;
      }
    },

    async editPost(post) {
      if (!this.editingContent || this.editingContent === post.text) return;
      try {
        await this.sendEditPost({ postId: post.id, text: this.editingContent });
        this.editing = '';
        this.editingContent = '';
      } catch (e) {
        console.error(e);
      }
    },

    deletePost(postId) {
      const ans = confirm('Удалить пост?');
      if (!ans) return;
      this.sendDeletePostRequest(postId);
    },
  },
};
</script>
