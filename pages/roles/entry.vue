<template>
  <div id="roleEntry">
    <v-container grid-list-xl fluid>
      <v-row>
        <v-col>
          <h4>{{ formTitle }}</h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <validation-observer
            ref="form"
            v-slot="{ handleSubmit, invalid, reset }"
          >
            <v-form
              @submit.prevent="handleSubmit(onSubmit)"
              @reset.prevent="reset"
            >
              <v-card>
                <v-card-text>
                  <b-text
                    v-model="role.name"
                    rules="required|min:3|alpha_dash"
                    outlined
                    prepend-icon="mdi-rename-box"
                    label="Name"
                    hint="Type like, company-owner"
                    :disabled="can_edit"
                  />
                  <b-text
                    v-model="role.label"
                    rules="required|min:3|alpha_dash"
                    outlined
                    prepend-icon="mdi-label"
                    label="Label"
                  />
                </v-card-text>
                <action-button
                  :loading="loading"
                  :error="invalid"
                  :title="formTitle"
                />
              </v-card>
            </v-form>
          </validation-observer>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'RoleEntry',
  data() {
    return {
      loading: false,
      role: {
        id: 0,
        name: '',
        label: '',
      },
    };
  },
  computed: {
    formTitle() {
      return this.$route.query.id ? 'Update Role' : 'Create Role';
    },
    can_edit() {
      return !!this.$route.query.id;
    },
  },
  mounted() {
    if (this.$route.query.id) {
      this.getRole();
    }
  },
  methods: {
    onSubmit() {
      let url;
      let method;
      const roleId = this.$route.query.id;
      if (roleId) {
        url = `role/${roleId}`;
        method = 'PATCH';
        this.update(url, method);
      } else {
        url = `role`;
        method = 'POST';
        this.update(url, method);
      }
    },
    async update(url, method) {
      try {
        const { message } = (
          await this.$axios({
            url,
            method,
            data: this.role,
          })
        ).data;

        this.$store.dispatch('crud_success', {
          message,
          path: '/roles',
        });
      } catch (err) {
        if (err.response.status === 422) {
          const { errors } = err.response.data;
          this.$refs.form.setErrors(errors);
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
    // get role for edit
    async getRole() {
      try {
        const { data } = await this.$axios.$get(`role/${this.$route.query.id}`);
        this.role = data;
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
