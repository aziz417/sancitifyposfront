<template>
  <div id="auth">
    <v-app>
      <v-main>
        <v-container fluid fill-height>
          <nuxt />
        </v-container>
      </v-main>
      <v-snackbar
        v-if="snackbar"
        :value="snackbar.show"
        :timeout="snackbar.timeout"
        top
        :color="snackbar.color"
        @input="$store.commit('CLOSE_SNACKBAR')"
      >
        {{ snackbar.message }}
        <template v-slot:action="{ attrs }">
          <v-btn
            dark
            text
            icon
            v-bind="attrs"
            @click.native="$store.commit('CLOSE_SNACKBAR')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
  computed: {
    settings() {
      return this.$store.state.settings;
    },
    snackbar() {
      return this.$store.state.snackbar;
    },
  },
  created() {
    // get common settings
    this.$store.dispatch('get_common_settings');
    // get csrf token from api
    // this.$store.dispatch('auth/setCSRFToken');
  },
  head() {
    return {
      title: this.settings.site_name,
      link: [
        {
          rel: 'icon',
          hid: 'favicon',
          type: 'image/x-icon',
          href: this.settings.company_favicon,
        },
      ],
    };
  },
};
</script>
