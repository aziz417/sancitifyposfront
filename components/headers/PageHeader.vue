<template>
  <v-layout row class="align-center layout page-header">
    <v-breadcrumbs divider="-" :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <template v-if="item.icon">
          <nuxt-link
            :to="item.to"
            class="v-breadcrumbs__item"
            :class="[item.disabled && 'v-breadcrumbs__item--disabled']"
          >
            <v-icon :color="item.disabled ? 'rgba(0,0,0,0.38)' : 'primary'">
              mdi-home
            </v-icon>
          </nuxt-link>
        </template>
        <template v-else>
          <nuxt-link
            :to="item.to"
            class="v-breadcrumbs__item"
            :class="[item.disabled && 'v-breadcrumbs__item--disabled']"
          >
            {{ item.text }}
          </nuxt-link>
        </template>
      </template>
    </v-breadcrumbs>
    <v-spacer />
    <div class="page-header-right">
      <v-btn icon @click="refreshContents">
        <v-icon class="text--secondary">mdi-refresh</v-icon>
      </v-btn>
    </div>
  </v-layout>
</template>

<script>
import { capitalize } from '@/util';

export default {
  name: 'PageHeader',
  computed: {
    breadcrumbs() {
      const crumbs = [
        {
          text: 'Dashboard',
          to: '/',
          path: '/',
          disabled: false,
          icon: true,
        },
      ];
      const pathArray = this.$route.path.split('/');
      pathArray.shift();
      const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        let title = capitalize(
          path.split('/').reverse()[0].split('-').join(' ')
        );
        if (this.$route.path === '/') {
          title = 'Dashboard';
        }
        breadcrumbArray.push({
          path,
          to: breadcrumbArray[idx - 1]
            ? '/' + breadcrumbArray[idx - 1].path + '/' + path
            : '/' + path,
          text: title,
          icon: false,
          disabled: path === this.$route.path.split('/').reverse()[0],
        });
        return breadcrumbArray;
      }, []);

      return [...crumbs, ...breadcrumbs];
    },
  },
  methods: {
    refreshContents() {
      window.getApp.$emit('REFRESH_PAGE_CONTENT');
    },
  },
};
</script>
