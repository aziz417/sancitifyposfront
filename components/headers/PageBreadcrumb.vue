<template>
  <v-row>
    <v-col cols="12" md="10">
      <v-breadcrumbs large divider="-" :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <template v-if="item.icon">
            <v-breadcrumbs-item
              nuxt
              :to="item.to"
              :disabled="item.disabled"
              :exact="item.exact"
            >
              <v-icon color="primary"> mdi-home </v-icon>
            </v-breadcrumbs-item>
          </template>
          <template v-else>
            <v-breadcrumbs-item
              nuxt
              :to="item.to"
              :disabled="item.disabled"
              :exact="item.exact"
            >
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
        </template>
      </v-breadcrumbs>
    </v-col>
    <v-col cols="12" md="2">
      <div class="d-flex justify-end align-center">
        <v-btn icon @click="refreshContents">
          <v-icon class="text--secondary">mdi-refresh</v-icon>
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PageBreadcrumb',
  props: {
    paths: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    breadcrumbs() {
      const crumbs = [
        {
          text: 'Home',
          to: '/',
          path: '/',
          disabled: false,
          icon: true,
          exact: true,
        },
      ];
      const pathArray = this.$route.path.split('/');
      pathArray.shift();
      let breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        let title = this.capitalize(
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

      if (this.paths.length) {
        breadcrumbs = this.paths;
      }

      return [...crumbs, ...breadcrumbs];
    },
  },
  methods: {
    refreshContents() {
      window.getApp.$emit('REFRESH_PAGE_CONTENT');
    },
    capitalize(str) {
      str = str || '';

      return str.replace(/\w\S*/g, function (word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      });
    },
  },
};
</script>
