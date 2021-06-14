<template>
  <v-row>
    <v-col
      v-if="!editMode"
      lg="6"
      md="6"
      sm="12"
      xs="12">
      <h1 class="display-2 mb-3">
        Настройки
      </h1>
      <v-form>
        <v-banner
          ref="username"
          single-line>
          <v-icon slot="icon">
            mdi-account
          </v-icon>
          {{ currentUser.username }}
        </v-banner>
        <v-banner
          ref="email"
          single-line>
          <v-icon slot="icon">
            mdi-at
          </v-icon>
          {{ currentUser.email }}
        </v-banner>
        <v-banner
          ref="avatar"
          single-line>
          <v-icon slot="icon">
            mdi-camera
          </v-icon>
          <v-img
            v-if="currentUser.avatar"
            :src="currentUser.avatar"
            :height="200"
            contain />
          <span v-else>
            Не выбрано
          </span>
        </v-banner>
        <v-banner
          ref="profile_header"
          class="mb-3"
          single-line>
          <v-icon slot="icon">
            mdi-image
          </v-icon>
          <v-img
            v-if="currentUser.profile_header"
            :src="currentUser.profile_header"
            :height="200"
            contain />
          <span v-else>
            Не выбрано
          </span>
        </v-banner>
        <v-btn
          elevation="2"
          color="primary"
          @click="toggleEditMode">
          Редактировать
        </v-btn>
      </v-form>
    </v-col>
    <v-col
      v-else
      lg="6"
      md="6"
      sm="12"
      xs="12">
      <h1 class="display-2 mb-3">
        Редактировать профиль
      </h1>
      <v-form ref="form">
        <v-text-field
          ref="username"
          v-model="user.username"
          label="Имя пользователя"
          prepend-icon="mdi-account"
          :rules="loginRules" />
        <v-text-field
          ref="email"
          v-model="user.email"
          label="Email"
          prepend-icon="mdi-at"
          :rules="emailRules" />
        <v-file-input
          v-model="user.avatar"
          :rules="avatarRules"
          accept="image/png, image/jpeg, image/bmp"
          placeholder="Выберете аватар"
          prepend-icon="mdi-camera"
          label="Аватар" />
        <v-file-input
          v-model="user.profile_header"
          :rules="avatarRules"
          accept="image/png, image/jpeg, image/bmp"
          placeholder="Выберете файл"
          prepend-icon="mdi-image"
          label="Шапка профиля" />
        <v-btn
          elevation="2"
          class="mr-3 mb-2"
          :loading="loading"
          color="primary"
          :disabled="!hasChanges"
          @click="submit">
          Сохранить изменения
        </v-btn>
        <v-btn
          elevation="2"
          class="mb-2"
          color="red white--text"
          @click="toggleEditMode">
          Отменить
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { isEqual, cloneDeep } from 'lodash-es';

export default {
  name: 'Settings',

  data() {
    return {
      editMode: false,
      loading: false,
      user: {
        username: '',
        email: '',
        avatar: null,
        profile_header: null,
      },
      loginRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 6 characters',
      ],
      emailRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 6) || 'Min 6 characters',
      ],
      avatarRules: [
        value => !value || value.size < 2000000 || 'File size should be less than 2 MB!',
      ],
    };
  },

  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),

    hasChanges() {
      return !isEqual(this.user, this.currentUser);
    },
  },

  methods: {
    ...mapActions('settings', {
      requestDeleteUser: 'DELETE_USER',
      updateUser: 'UPDATE_USER',
    }),

    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true;
          const fd = new FormData();
          fd.append('username', this.user.username);
          fd.append('email', this.user.email);
          if (this.user.avatar) {
            fd.append('avatar', this.user.avatar);
          }
          if (this.user.profile_header) {
            fd.append('profile_header', this.user.profile_header);
          }
          await this.updateUser({
            data: fd,
          });
          this.editMode = false;
        } catch (e) {
          alert(e);
        } finally {
          this.loading = false;
        }
      }
    },

    toggleEditMode() {
      this.editMode = !this.editMode;
      this.user = {
        ...cloneDeep(this.currentUser),
        avatar: null,
        profile_header: null,
      };
    },

    async deleteUser() {
      const answer = confirm('Вы уверены, что хотите удалить этот аккаунт?');
      if (!answer) return;
      await this.requestDeleteUser();
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>
