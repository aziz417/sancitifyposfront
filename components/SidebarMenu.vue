<template>
  <v-navigation-drawer id="appDrawer" v-model="drawer" fixed app width="260">
    <v-toolbar color="primary darken-1" dark>
      <h1>Paflex</h1>
      <!-- <img :src="logo" class="w-100 h-100" alt="paflex" /> -->
    </v-toolbar>
    <scrollbar class="drawer-menu--scroll">
      <v-list dense expand class="pb-4">
        <v-subheader>Dashboard</v-subheader>
        <v-list-item nuxt to="/">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Dashboard </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-can="[
            'viewAny user',
            'view user',
            'create user',
            'update user',
            'delete user',
          ]"
          nuxt
          to="/users"
          ripple="ripple"
        >
          <v-list-item-action>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title title="User"> User </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-can="[
            'viewAny role',
            'view role',
            'create role',
            'update role',
            'delete role',
          ]"
          nuxt
          to="/roles"
          ripple="ripple"
        >
          <v-list-item-action>
            <v-icon>mdi-lock</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title title="Roles"> Roles </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-can="['viewAny permission', 'view permission', 'update permission']"
          nuxt
          to="/role-permissions"
          ripple="ripple"
        >
          <v-list-item-action>
            <v-icon>mdi-lock</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title title="Role wise Permissions">
              Role wise Permissions
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-can="['viewAny activity', 'view activity', 'delete activity']"
          nuxt
          to="/administrations/activity-log"
          ripple="ripple"
        >
          <v-list-item-action>
            <v-icon>mdi-history</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title title="Activities Log">
              Activities Log
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </scrollbar>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import { VList } from 'vuetify/lib';
import Scrollbar from './Scrollbar';

export default {
  name: 'Sidebar',
  components: {
    VList,
    Scrollbar,
  },
  props: {
    logo: {
      type: String,
      default: '/logo.png',
    },
  },
  data: () => ({
    drawer: true,
    scrollSettings: {
      maxScrollbarLength: 60,
    },
  }),
  computed: {
    items() {
      const array = [];
      this.menus.forEach((item) => {
        const menu = {
          header: item.title,
          divider: true,
          items: item,
        };
        array.push(menu);
      });
      return array;
    },
    ...mapGetters({
      menus: 'common/menus',
    }),
  },
  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.getApp.$on('APP_DRAWER_TOGGLED', () => {
      this.drawer = !this.drawer;
    });
  },
};
</script>
