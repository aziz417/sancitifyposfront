<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6" md="6">
        <v-card class="elevation-2 pa-3" min-height="300">
          <validation-observer ref="form" v-slot="{ handleSubmit, reset }">
            <v-form
              @submit.prevent="handleSubmit(sendEmail)"
              @reset.prevent="reset"
            >
              <v-card-title class="justify-center">
                Resend Email Confirmation Link
              </v-card-title>
              <v-divider />
              <v-card-text>
                <b-text
                  v-model="email"
                  rules="required|email"
                  prepend-icon="mdi-email"
                  label="Email"
                  type="email"
                  vid="email"
                  required
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn :loading="loading" color="primary" type="submit">
                  Resend
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'ResentEmail',
  data() {
    return {
      email: '',
      loading: false,
    };
  },
  methods: {
    // send verification token into email
    async sendEmail() {
      this.loading = true;
      try {
        const { message } = await this.$axios.$get(
          `auth/email/resend/${this.email}`
        );
        this.loading = false;
        this.email = '';
        this.$router.replace('/auth/login');
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
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
