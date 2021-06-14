import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import cookie from 'js-cookie';
import api from '@/assets/utils/api';

Vue.use(VueRouter);
const DEFAULT_TITLE = 'Social UP!';

const routes = [
  {
    path: '',
    name: 'Root',
    redirect: { name: 'Login' },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/Auth'),
    redirect: { name: 'Login' },
    meta: {
      guest: true,
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Auth/pages/Login'),
        meta: {
          guest: true,
          title: 'Авторизация',
        },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Auth/pages/Register'),
        meta: {
          guest: true,
          title: 'Регистрация',
        },
      },
    ],
  },
  {
    path: '/user/:id',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile'),
    meta: {
      requiresAuth: true,
      title: store.getters['profile/username'],
    },
  },
  {
    path: '/people',
    name: 'People',
    components: {
      default: () => import('@/views/People'),
      header: () => import('@/views/People/SearchBar'),
    },
    meta: {
      requiresAuth: true,
      title: 'Сообщество',
    },
  },
  {
    path: '/messenger',
    name: 'Messenger',
    component: () => import(/* webpackChunkName: "messenger" */ '@/views/Messenger'),
    meta: {
      requiresAuth: true,
      title: 'Мессенджер',
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings'),
    meta: {
      requiresAuth: true,
      title: 'Настройки',
    },
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/404'),
    meta: {
      guest: true,
      title: 'Не найдено',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (cookie.get('access_token')) {
    if (!api.defaults.headers.common.Authorization) {
      api.defaults.headers.common.Authorization = cookie.get('access_token');
    }
    if (!store.getters.currentUsersId) {
      await store.dispatch('GET_CURRENT_USER');
    }
    store.commit('SET_AUTHENTICATE', true);
  } else {
    store.commit('SET_AUTHENTICATE', false);
  }
  if (to.matched.some(route => route.meta.requiresAuth) && !store.state.isAuthenticate) {
    next({ name: 'Login' });
  } else if (to.matched.some(route => route.meta.guest) && store.state.isAuthenticate) {
    next({ name: 'Profile', params: { id: store.state.user.id }});
  } else {
    next();
  }
});

router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;
