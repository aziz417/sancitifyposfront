<template>
  <div id="rolePermission">
    <v-container fluid>
      <validation-observer v-slot="{ handleSubmit, invalid, reset }">
        <v-form
          @submit.prevent="handleSubmit(updateRole)"
          @reset.prevent="reset"
        >
          <v-card class="mb-4">
            <v-row justify="center">
              <v-col cols="12" md="6">
                <validation-provider
                  v-slot="{ errors, valid, dirty }"
                  ref="role"
                  name="role"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="role.id"
                    :items="roles"
                    :error-messages="errors"
                    label="Select Role"
                    item-text="name"
                    item-value="id"
                    :success="valid && dirty"
                    chips
                    @change="loadPermissions"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-card>
          <v-card>
            <v-card-title class="role-entry">
              <div>
                <v-btn class="success" @click="selectAll"> Select All </v-btn>
                <v-btn class="error" @click="revokeAll"> Revoke All </v-btn>
              </div>
              <v-spacer />
              <div>
                <v-btn class="info" @click="expandAll"> Expand All </v-btn>
                <v-btn class="warning" @click="closeAll"> Close All </v-btn>
              </div>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-expansion-panels v-model="panel" multiple>
                <v-expansion-panel
                  v-for="(item, index) in permissions"
                  :key="index"
                >
                  <v-expansion-panel-header>
                    <h5 class="text-capitalize">
                      {{ index }}
                    </h5>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content :key="index">
                    <v-card>
                      <v-card-text>
                        <v-row>
                          <v-checkbox
                            v-for="(name, id) in item"
                            :key="id"
                            v-model="role.permissions"
                            :label="name"
                            :value="id"
                            hide-details
                            class="mr-3 mt-0"
                          />
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
            <action-button
              :loading="loading"
              :error="invalid"
              :title="permissionTitle"
            />
          </v-card>
        </v-form>
      </validation-observer>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'PermissionEntry',
  data() {
    return {
      loading: false,
      role: {
        id: '',
        permissions: [],
      },
      defaultRole: {
        id: '',
        permissions: [],
      },
      permissions: [],
      panel: [],
      roles: [],
    };
  },
  computed: {
    permissionTitle() {
      return this.$route.query.id ? 'Edit Permissions' : 'Add Permissions';
    },
  },
  mounted() {
    this.getRoles();
    this.getPermissions();
    window.getApp.$on('REFRESH_PAGE_CONTENT', () => {
      this.getRoles();
      this.getPermissions();
    });
  },
  methods: {
    // expand all panels.
    expandAll() {
      Object.keys(this.permissions).map((item, i) => this.panel.push(i));
    },
    // close all panels.
    closeAll() {
      this.panel = [];
    },
    // select all permissions.
    selectAll() {
      this.role.permissions = [];
      for (const [, val] of Object.entries(this.permissions)) {
        for (const [i] of Object.entries(val)) {
          this.role.permissions.push(i);
        }
      }
    },
    // revoke all permissions.
    revokeAll() {
      this.role.permissions = [];
    },
    // load assigned permissions
    loadPermissions(role) {
      this.getPermissionsByRole(role);
    },
    // get roles
    async getRoles() {
      try {
        this.roles = await this.$axios.$get(`role-all`);
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    // get permissions
    async getPermissions() {
      try {
        this.permissions = await this.$axios.$get(`permission`);
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    // get permissions
    async getPermissionsByRole(role) {
      this.role.permissions = [];
      try {
        const data = await this.$axios.$get(`get-permission/${role}`);
        if (data.length) {
          data.map((val) => this.role.permissions.push(val.toString()));
          this.expandAll();
        }
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    async updateRole() {
      this.loading = true;
      try {
        const { message } = await this.$axios.$patch(
          `add-permission/${this.role.id}`,
          this.role
        );
        this.loading = false;
        Object.assign(this.role, this.defaultRole);
        this.closeAll();
        this.$nextTick(() => this.$refs.role.reset());
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.loading = false;

        if (err.response.status === 422) {
          const { errors } = err.response.data;
          const fields = Object.values(errors);
          for (let i = 0; i < fields.length; i++) {
            for (let j = 0; j < fields[i].length; j++) {
              this.$toasted.global.form_error(fields[i][j]);
            }
          }
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
  },
};
</script>
