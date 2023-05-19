<template>
  <div id="activityLog">
    <v-container grid-list-xl fluid>
      <v-row>
        <v-col>
          <div style="display: flex">
            <h3>Activities Log</h3>
            <v-spacer />
            <v-btn
              v-can="`delete activity`"
              :loading="deleting"
              color="pink"
              class="white--text"
              @click="deleteAll"
            >
              Delete All
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
              />
              <v-btn icon>
                <v-icon>mdi-filter-variant</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <v-data-table
                v-model="selected"
                :headers="headers"
                :items="activity_logs"
                :options.sync="pagination"
                :server-items-length="total"
                :loading="loading"
                disable-sort
                show-select
                class="elevation-1"
              >
                <template #item.action="{ item }">
                  <v-btn
                    v-can="`delete activity`"
                    depressed
                    outlined
                    icon
                    fab
                    dark
                    color="pink"
                    small
                    @click="deleteItem(item)"
                  >
                    <v-icon> mdi-delete </v-icon>
                  </v-btn>
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
  name: 'ActivityLog',
  data() {
    return {
      activity_logs: [],
      selected: [],
      search: '',
      total: 0,
      loading: false,
      deleting: false,
      pagination: {
        descending: true,
      },
      headers: [
        { text: 'Subject Type', value: 'subject_type' },
        { text: 'Subject ID', value: 'subject_id' },
        { text: 'User', value: 'user_name' },
        { text: 'Description', value: 'description' },
        { text: 'Created At', value: 'created_at' },
        { text: 'Updated At', value: 'updated_at' },
        { text: 'Actions', value: 'action', align: 'center' },
      ],
      rowsPerPageItems: [10, 20, 50, 100],
    };
  },
  watch: {
    // for server side pagination
    pagination() {
      this.getActivityLogsByPagination();
    },
    // for server side search
    search() {
      this.getActivityLogsByPagination();
    },
  },
  mounted() {
    window.getApp.$on('REFRESH_PAGE_CONTENT', () =>
      this.getActivityLogsByPagination()
    );
  },
  beforeDestroy() {
    window.getApp.$off('REFRESH_PAGE_CONTENT');
  },
  methods: {
    // get activity logs by pagination
    getActivityLogsByPagination: debounce(async function () {
      this.loading = true;
      let url = `page=${this.pagination.page}&per_page=${this.pagination.itemsPerPage}`;
      // get by search keyword
      if (this.search) {
        url += `&query=${this.search}`;
      }
      try {
        const { data, meta } = await this.$axios.$get(`activity-log?${url}`);
        this.loading = false;
        this.activity_logs = data;
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
          this.deleteLog(item.id);
        }
        return false;
      });
    },
    async deleteLog(id) {
      try {
        const { message } = await this.$axios.$delete(`activity-log/${id}`);
        this.getActivityLogsByPagination();
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    // delete all
    deleteAll() {
      confirmDelete().then((res) => {
        if (res.value) {
          this.deleteAllLogs();
        }
        return false;
      });
    },
    async deleteAllLogs() {
      this.deleting = true;
      try {
        const ids = this.selected.reduce((items, item) => {
          items.push(item.id);
          return items;
        }, []);
        const { message } = await this.$axios.$delete(
          `activity-log?ids=${ids}`
        );
        this.deleting = false;
        this.getActivityLogsByPagination();
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (e) {
        this.deleting = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
  },
};
</script>
