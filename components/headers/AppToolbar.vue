<template>
  <v-app-bar id="appToolbar" color="primary" fixed app>
    <v-app-bar-nav-icon @click.stop="handleDrawerToggle"></v-app-bar-nav-icon>
    <!-- <v-toolbar-title class="ml-0 pl-3"></v-toolbar-title> -->
    <v-spacer />
    <v-btn icon @click="handleFullScreen()">
      <v-icon>mdi-fullscreen</v-icon>
    </v-btn>
    <v-menu offset-y origin="center center" transition="scale-transition" left>
      <template v-slot:activator="{ on }">
        <v-btn text icon large v-on="on">
          <div v-if="user">
            <v-avatar
              v-if="user.avatar === null"
              color="purple red--after"
              size="30px"
            >
              <span class="white--text">{{ text_image }}</span>
            </v-avatar>
            <v-avatar v-else size="30px">
              <img :src="user.avatar" :alt="user.name" />
            </v-avatar>
          </div>
          <v-avatar v-else color="purple red--after" size="45px">
            <span class="white--text">{{ text_image }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/my-profile" ripple nuxt>
          <v-list-item-action>
            <v-icon> mdi-account-circle </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Profile </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item ripple @click="logout">
          <v-list-item-action>
            <v-icon> mdi-logout </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Logout </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import Util from '@/util';
export default {
  name: 'AppToolbar',
  data: () => ({
    text_image: '',
  }),
  computed: {
    user() {
      return this.$auth.user;
    },
    loggedIn() {
      return this.$auth.loggedIn;
    },
  },
  mounted() {
    // generate image
    if (this.user) {
      if (this.user.avatar === null) {
        // split username and get first two letter from two words
        const array = this.user.name.split(' ');
        array.forEach((item) => {
          this.text_image += item.substring(0, 1);
        });
      }
    }
  },
  methods: {
    handleDrawerToggle() {
      window.getApp.$emit('APP_DRAWER_TOGGLED');
    },
    handleFullScreen() {
      Util.toggleFullScreen();
    },
    async logout() {
      try {
        await this.$auth.logout();

        this.$store.dispatch('logout_success', 'Successfully Logged Out!');
      } catch (e) {
        this.$store.commit('auth/SET_LOGGED_OUT');
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
  },
};
</script>
