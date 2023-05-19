import Vue from 'vue';
import Toasted from 'vue-toasted';

Vue.use(Toasted, {
  position: 'top-center',
  iconPack: 'mdi',
  duration: 3000,
  action: {
    icon: 'mdi-close',
    onClick: (e, target) => {
      target.goAway(0);
    },
  },
});

Vue.toasted.register(
  'form_error',
  (payload) => {
    if (!payload) {
      return 'Something went wrong, please try again later.';
    }
    return payload;
  },
  {
    position: 'top-center',
    type: 'error',
    icon: 'alert-circle-outline',
    duration: 0,
  }
);
