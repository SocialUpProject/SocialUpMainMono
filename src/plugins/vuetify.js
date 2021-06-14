import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ru from 'vuetify/es5/locale/ru';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { ru },
    current: 'ru',
  },
  breakpoint: {
    thresholds: {
      xs: 340,
      sm: 770,
      md: 1280,
      lg: 1920,
    },
  },
});
