<template>
  <div id="userEntry">
    <v-container fluid>
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
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <b-text
                        v-model="user.first_name"
                        rules="required|min:3|alpha_spaces"
                        outlined
                        prepend-icon="mdi-account"
                        label="First Name"
                        vid="first_name"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <b-text
                        v-model="user.last_name"
                        rules="required|min:3|alpha_spaces"
                        outlined
                        prepend-icon="mdi-account"
                        label="Last Name"
                        vid="last_name"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <b-text
                        v-model="user.email"
                        rules="required|email"
                        outlined
                        prepend-icon="mdi-email"
                        label="Email"
                        vid="email"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <b-text
                        v-model="user.phone"
                        outlined
                        prepend-icon="mdi-phone"
                        label="Phone"
                        vid="phone"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <b-text
                        v-model="user.username"
                        outlined
                        prepend-icon="mdi-account"
                        label="Username"
                        vid="username"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <b-password
                        v-if="passwordRequired"
                        v-model="user.password"
                        rules="min:8"
                        label="Password"
                        outlined
                        vid="password"
                      />
                      <b-password
                        v-else
                        v-model="user.password"
                        rules="required|min:8"
                        label="Password"
                        outlined
                        vid="password"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <b-auto-complete
                        v-model="user.role"
                        :items="roles"
                        rules="required"
                        item-text="label"
                        item-value="name"
                        prepend-icon="mdi-lock"
                        outlined
                        label="Select Role"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="4">
                      <b-checkbox
                        v-model="user.email_verified_at"
                        label="Mark email as verified"
                      />
                    </v-col>
                    <!-- <v-col cols="12" md="4">
                      <active-inactive-dialog v-model="user.status" />
                    </v-col> -->
                  </v-row>
                </v-container>
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
  name: 'UserEntry',
  data() {
    return {
      show: false,
      loading: false,
      user: {
        id: 0,
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        username: '',
        phone: '',
        email_verified_at: true,
        role: '',
        status: 'active',
      },
      roles: [],
    };
  },
  computed: {
    formTitle() {
      return this.$route.query.id ? 'Update User' : 'Create User';
    },
    passwordRequired() {
      return !!this.$route.query.id;
    },
    name() {
      return `${this.user.first_name} ${this.user.last_name}`;
    },
  },
  async mounted() {
    await this.getRoles();
    await this.getUser();
  },
  methods: {
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
    // get roles
    async getUser() {
      try {
        // get user if user is edit mode
        const UserId = this.$route.query.id;
        if (UserId) {
          const { data } = await this.$axios.$get(`customer/${UserId}`);
          console.log({ data });
          this.user = data;
        }
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    onSubmit() {
      let url;
      let method;
      const userId = this.$route.query.id;
      if (userId) {
        url = `customer/${userId}`;
        method = 'PATCH';
        this.update(url, method);
      } else {
        url = `customer`;
        method = 'POST';
        this.update(url, method);
      }
    },
    async update(url, method) {
      this.loading = true;
      try {
        this.user = Object.assign({}, { ...this.user, name: this.name });
        const { message } = (
          await this.$axios({
            url,
            method,
            data: this.user,
          })
        ).data;
        this.loading = false;
        this.$store.dispatch('crud_success', {
          message,
          path: '/users',
        });
      } catch (err) {
        this.loading = false;
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
  },
};
</script>
