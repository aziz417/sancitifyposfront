<template>
  <div id="app">
    <v-app>
      <sidebar-menu :logo="settings.small_logo" />
      <app-toolbar />
      <v-main>
        <div class="page-wrapper">
          <nuxt />
        </div>
        <v-footer height="auto" class="pa-3 app--footer">
          <span class="caption">
            Today is {{ today }} |
            {{ settings.footer_text }}
          </span>
          <v-spacer />
          <span class="caption">
            &copy; {{ new Date().getFullYear() }}
            <a :href="developer_address" target="_blank" rel="noopener">
              {{ developer }}
            </a>
            &nbsp;&nbsp;| All Rights Reserved | Version 1.0
          </span>
        </v-footer>
      </v-main>
      <!-- Go to top -->
      <app-fab />
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
import { format } from 'date-fns';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: 'Hazrat Mushfiq Ahmad Rh.',
      developer: 'paflex',
      developer_address: 'https://paflex.com',
      today: format(new Date(), 'EEEE, dd MMMM yyyy'),
    };
  },
  computed: {
    showHeader() {
      const path = this.$route.path;
      if (path.includes('entry')) {
        return true;
      } else if (path.includes('my-profile')) {
        return true;
      } else {
        return false;
      }
      // return true;
    },
    snackbar() {
      return this.$store.state.snackbar;
    },
    settings() {
      return this.$store.state.settings;
    },
  },
  mounted() {
    // get menus
    this.$store.dispatch('common/getMenus');
  },
  created() {
    // get common settings
    // this.$store.dispatch('get_common_settings');
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.getApp = this;
  },
  head() {
    return {
      title: this.settings.site_name,
      link: [
        {
          rel: 'icon',
          hid: 'favicon',
          type: 'image/x-icon',
          href: this.settings.favicon,
        },
      ],
    };
  },
};
</script>
