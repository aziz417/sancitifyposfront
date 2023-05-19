<template>
  <div id="dashboard">
    <page-breadcrumb :paths="breadcrumbs" />
    <v-container grid-list-xl fluid>
      <!-- <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="primary white--text">
              Categories
            </v-card-title>
            <v-data-table
              :headers="category_headers"
              :items="categories"
              class="elevation-1"
            >
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" md="6"></v-col>
      </v-row> -->
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      categories: [],
      category_headers: [
        { text: 'Name', value: 'name' },
        { text: 'Courses', value: 'courses_count' },
        { text: 'Learners', value: 'users_count' },
      ],
      breadcrumbs: [
        {
          text: 'Dashboard',
          to: '/',
          path: '/',
          disabled: true,
          icon: false,
          exact: true,
        },
      ],
    };
  },
  async mounted() {
    await this.getCategories();
  },
  methods: {
    // get categories with courses
    async getCategories() {
      try {
        const { data } = await this.$axios.$get(`training/report/categories`);
        this.categories = data;
      } catch (e) {}
    },
  },
};
</script>
