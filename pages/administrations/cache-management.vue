<template>
  <div id="cacheManagement">
    <v-container grid-list-xl fluid>
      <v-row>
        <v-col>
          <h4>Cache Management</h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-data-table
              :headers="headers"
              :items="commands"
              :loading="loading"
              hide-default-footer
              item-key="key"
              loading-text="Loading... Please wait"
              class="elevation-1"
            >
              <template #item.key="{ item }">
                <v-btn
                  small
                  :color="item.class"
                  class="text-lowercase"
                  @click="applyCommand(item.key)"
                >
                  {{ item.key }}
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { confirmMessage } from '@/plugins/sweetalert';

export default {
  name: 'CacheManagement',
  data() {
    return {
      commands: [],
      loading: false,
      headers: [
        { text: 'Description', value: 'text' },
        { text: 'Actions', value: 'key' },
      ],
    };
  },
  mounted() {
    this.getSupportedArtisanCommands();
    window.getApp.$on('REFRESH_PAGE_CONTENT', () =>
      this.getSupportedArtisanCommands()
    );
  },
  beforeDestroy() {
    window.getApp.$off('REFRESH_PAGE_CONTENT');
  },
  methods: {
    // get supported commands
    async getSupportedArtisanCommands() {
      this.loading = true;
      try {
        const data = await this.$axios.$get(`supported-commands`);
        this.commands = data;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },

    applyCommand(command) {
      confirmMessage('You want to do this action!', 'Yes, do it!').then(
        (res) => {
          if (res.value) {
            this.runCommand(command);
          }
          return false;
        }
      );
    },
    async runCommand(command) {
      this.loading = true;
      try {
        const { message } = await this.$axios.$get(`run-command/${command}`);
        this.loading = false;
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (e) {
        this.loading = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
  },
};
</script>
