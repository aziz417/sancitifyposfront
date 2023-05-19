<template>
  <div id="customersList">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <div style="display: flex">
            <h3>Users</h3>
            <v-spacer />
            <v-btn v-can="`create user`" to="/users/entry" color="primary" nuxt>
              Create User
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-card-title class="pa-1">
              <v-text-field
                v-model="search"
                solo
                flat
                prepend-inner-icon="mdi-magnify"
                placeholder="Type something"
                hide-details
              ></v-text-field>
              <v-btn icon>
                <v-icon>mdi-filter-variant</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-data-table
                v-model="selected"
                :headers="headers"
                :items="customers"
                :options.sync="pagination"
                :server-items-length="total"
                :loading="loading"
                show-select
                class="elevation-1"
              >
                <template v-slot:item.avatar="{ item }">
                  <v-avatar v-if="item.avatar" size="32">
                    <img :src="item.avatar" :alt="item.name" />
                  </v-avatar>
                  <v-avatar v-else size="32" color="purple red--after">
                    <span class="white--text">
                      {{ item.name | avatar }}
                    </span>
                  </v-avatar>
                </template>
                <template v-slot:item.action="{ item }">
                  <edit-in-same-page-actions
                    update="update user"
                    delete-action="delete user"
                    :to="`/users/entry?id=${item.id}`"
                    @deleteItem="deleteItem(item)"
                  />
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';
import { confirmDelete } from '@/plugins/sweetalert';

export default {
  name: 'User',
  data() {
    return {
      customers: [],
      selected: [],
      search: '',
      total: 0,
      loading: false,
      pagination: {},
      headers: [
        { text: 'Avatar', value: 'avatar' },
        { text: 'First Name', value: 'first_name' },
        { text: 'Last Name', value: 'last_name' },
        { text: 'Username', value: 'username' },
        { text: 'Email', value: 'email' },
        {
          text: 'Actions',
          value: 'action',
          sortable: false,
          align: 'center',
          width: '150px',
        },
      ],
      itemsPerPageItems: [10, 20, 50, 100],
    };
  },
  watch: {
    pagination() {
      this.getUserByPagination();
    },
    search() {
      this.getUserByPagination();
    },
  },
  mounted() {
    window.getApp.$on('REFRESH_PAGE_CONTENT', () => this.getUserByPagination());
  },
  beforeDestroy() {
    window.getApp.$off('REFRESH_PAGE_CONTENT');
  },
  methods: {
    // get customer by pagination
    getUserByPagination: debounce(async function () {
      this.loading = true;
      let url = `page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`;
      // get by search keyword
      if (this.search) {
        url += `&query=${this.search}`;
      }

      // get by sort option
      if (this.pagination.sortBy.length && !this.search) {
        const direction = this.pagination.sortDesc[0] ? 'desc' : 'asc';

        url += `&direction=${direction}&sortBy=${this.pagination.sortBy[0]}`;
      }
      try {
        const { data, meta } = await this.$axios.$get(`customer?${url}`);
        this.loading = false;
        this.customers = data;
        this.total = meta.total;
      } catch (e) {
        this.loading = false;

        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    }, 500),
    // delete item
    deleteItem(item) {
      confirmDelete(
        "All data associated with the user will be deleted!. You won't be able to revert this!"
      ).then((res) => {
        if (res.value) {
          this.deleteUser(item.id);
        }
        return false;
      });
    },
    async deleteUser(id) {
      try {
        const { message } = await this.$axios.$delete(`customer/${id}`);
        this.getUserByPagination();
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
  },
};
</script>
