<template>
  <v-row
    class="layout flex column text-center"
    align-content="center">
    <v-col
      lg="6"
      md="6"
      sm="12">
      <v-img
        :src="require('@images/logo.png')"
        class="my-3"
        contain
        height="250" />
    </v-col>
    <v-col
      lg="6"
      md="6"
      sm="12">
      <h1 class="display-2 font-weight-bold mb-3">
        Регистрация
      </h1>
      <v-form ref="form">
        <v-text-field
          ref="username"
          v-model="username"
          label="Имя пользователя"
          :rules="loginRules" />
        <v-text-field
          ref="email"
          v-model="email"
          label="Email"
          :rules="emailRules" />
        <v-text-field
          ref="password"
          v-model="password"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          name="input-10-1"
          hint="At least 6 characters"
          label="Пароль"
          :rules="passwordRules"
          @click:append="show = !show"
          @keyup.enter="submit" />
        <v-text-field
          ref="confirm"
          v-model="passConfirm"
          type="password"
          label="Подтверждение пароля"
          :rules="confirmRules"
          @keyup.enter="submit" />
        <v-btn
          elevation="2"
          large
          color="primary"
          @click="submit">
          Зарегистрироваться
        </v-btn>
      </v-form>
      <div class="mt-3">
        <router-link :to="{ name: 'Login' }">
          Уже есть аккаунт? Войти
        </router-link>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Register',

  data() {
    return {
      show: false,
      username: '',
      email: '',
      password: '',
      passConfirm: '',
      loginRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 4) || 'Min 4 characters',
      ],
      passwordRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 6) || 'Min 6 characters',
      ],
      emailRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 8) || 'Min 8 characters',
      ],
      confirmRules: [
        value => !!value || 'Required.',
        value => (value === this.password) || 'Пароли не совпадают',
      ],
    };
  },

  methods: {
    ...mapActions('auth', {
      registerUser: 'REGISTER_USER',
    }),

    async submit() {
      if (this.$refs.form.validate()) {
        try {
          await this.registerUser({
            username: this.username,
            email: this.email,
            password: this.password,
          });
          await this.$router.push({ name: 'Login' });
        } catch (error) {
          alert(`Ошибка HTTP: ${error}`);
        }
      }
    },
  },
};
</script>
