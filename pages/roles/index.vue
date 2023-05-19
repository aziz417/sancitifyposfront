<template>
  <div id="roleList">
    <v-container grid-list-xl fluid>
      <v-row>
        <v-col>
          <div style="display: flex">
            <h3>Roles</h3>
            <v-spacer />
            <v-btn v-can="`create role`" to="/roles/entry" color="primary" nuxt>
              Create Role
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
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
                :items="roles"
                :options.sync="pagination"
                :server-items-length="total"
                :loading="loading"
                show-select
                class="elevation-1"
              >
                <template v-slot:item.action="{ item }">
                  <edit-in-same-page-actions
                    update="update role"
                    delete-action="delete role"
                    :to="`/roles/entry?id=${item.id}`"
                    @deleteItem="deleteItem(item)"
                  />
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';
import { confirmDelete } from '@/plugins/sweetalert';

export default {
  name: 'Role',
  data() {
    return {
      roles: [],
      selected: [],
      search: '',
      total: 0,
      loading: false,
      pagination: {},
      headers: [
        { text: 'Label', value: 'label' },
        { text: 'Name', value: 'name' },
        { text: 'Users Count', value: 'users_count', sortable: false },
        { text: 'Actions', value: 'action', sortable: false, align: 'center' },
      ],
      itemsPerPage: [10, 20, 50, 100],
    };
  },
  watch: {
    pagination() {
      this.getRoleByPagination();
    },
    search() {
      this.getRoleByPagination();
    },
  },
  mounted() {
    window.getApp.$on('REFRESH_PAGE_CONTENT', () => this.getRoleByPagination());
  },
  beforeDestroy() {
    window.getApp.$off('REFRESH_PAGE_CONTENT');
  },
  methods: {
    // get role by pagination
    getRoleByPagination: debounce(async function () {
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
        const { data, meta } = await this.$axios.$get(`role?${url}`);
        this.loading = false;
        this.roles = data;
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
      confirmDelete().then((res) => {
        if (res.value) {
          this.deleteRole(item.id);
        }
        return false;
      });
    },
    async deleteRole(id) {
      try {
        const { message } = await this.$axios.$delete(`role/${id}`);
        this.getRoleByPagination();
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
