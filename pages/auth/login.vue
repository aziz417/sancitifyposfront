<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="6" md="3">
      <v-card>
        <v-avatar size="150" tile>
          <h1>Paflex</h1>
          <!-- <v-img src="/logo.png" alt="paflex" contain /> -->
        </v-avatar>
        <div class="py-4" />

        <validation-observer ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(login)">
            <v-card-text>
              <b-email
                v-model="email"
                rules="required|email"
                label="Email"
                vid="email"
              />

              <b-password
                v-model="password"
                rules="required|min:8"
                label="Password"
                vid="password"
              />

              <p
                v-if="$store.state.settings.password_edit_enabled === 'true'"
                class="text-right ma-0"
              >
                <nuxt-link
                  class="error--text text-capitalize"
                  to="/auth/forgot-password"
                >
                  Forgot Password?
                </nuxt-link>
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn :loading="loading" color="primary" type="submit">
                Login
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { errorMessage } from '@/plugins/sweetalert';
import { activateVCan } from '@/plugins/can-directive';

export default {
  name: 'Login',
  layout: 'auth',
  auth: false,
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      show: false,
    };
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        });

        this.loading = false;

        const permissions =
          (this.$auth.loggedIn && this.$auth.user.permissions) || [];

        activateVCan(permissions);

        this.$router.replace('/');
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', 'Successfully Logged In!');
      } catch (err) {
        this.loading = false;

        if (err.response.status === 403) {
          errorMessage(err.response.data.message).then(() => {
            this.$router.push('/auth/resent-email');
          });
        } else if (err.response.status === 422) {
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
