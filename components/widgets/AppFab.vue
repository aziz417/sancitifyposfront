<template>
  <v-fab-transition>
    <v-btn
      v-if="fab"
      fab
      dark
      fixed
      bottom
      right
      small
      color="red"
      @click.stop="$vuetify.goTo(0)"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: 'AppFab',

  data: () => ({
    fab: false,
  }),
  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const top = Math.round(window.pageYOffset);

      if (top > 100) {
        this.fab = true;
      } else {
        this.fab = false;
      }
    },
  },
};
</script>
