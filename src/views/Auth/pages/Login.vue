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
        Авторизация
      </h1>
      <v-form ref="form">
        <v-text-field
          v-model="login"
          label="Email"
          :rules="loginRules"
          @keyup.enter="submit" />
        <v-text-field
          v-model="password"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          label="Пароль"
          :rules="passwordRules"
          @click:append="show = !show"
          @keyup.enter="submit" />
        <v-btn
          elevation="2"
          large
          color="primary"
          :disabled="fetching"
          @click="submit">
          Войти
        </v-btn>
        <div class="mt-3">
          <router-link :to="{ name: 'Register' }">
            Нет аккаунта? Зарегестрироваться
          </router-link>
        </div>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { debounce } from 'lodash-es';
import { socket, setSocket } from 'assets/socketio-client';

export default {
  name: 'Login',

  props: {
    showRegisterRoute: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    show: false,
    login: '',
    password: '',
    loginRules: [
      value => !!value || 'Required.',
      value => (value && value.length >= 8) || 'Min 8 characters',
    ],
    passwordRules: [
      value => !!value || 'Required.',
      value => (value && value.length >= 6) || 'Min 6 characters',
    ],
  }),

  computed: {
    ...mapState('auth', {
      fetching: state => state.fetching,
    }),
  },

  methods: {
    ...mapActions('auth', {
      loginUser: 'LOGIN_TO_ACCOUNT',
    }),
    submit: debounce(async function submit() {
      if (!this.$refs.form.validate()) return;
      if (this.fetching) return;
      try {
        const res = await this.loginUser({
          email: this.login,
          password: this.password,
        });
        await this.$router.push({ name: 'Profile', params: { id: res.data.id }});
        setSocket();
      } catch (error) {
        alert(`Ошибка HTTP: ${error}`);
        console.error(error);
      }
    }, 500),
  },
};
</script>
