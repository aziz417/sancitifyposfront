<template>
  <div id="myProfile">
    <v-container grid-list-xl fluid>
      <v-row>
        <v-col cols="12">
          <v-card v-if="user" class="my-2">
            <v-container grid-list-xl>
              <v-row>
                <v-col cols="12" md="3" class="text-xs-center">
                  <v-hover v-if="user.avatar === null">
                    <v-avatar
                      slot-scope="{ hover }"
                      color="purple red--after"
                      size="150px"
                    >
                      <span class="white--text display-3">
                        {{ user.name | avatar }}
                      </span>
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="
                            d-flex
                            teal
                            darken-1
                            v-card--reveal
                            transition-fast-in-fast-out
                          "
                          style="height: 100%"
                        >
                          <v-btn
                            color="primary"
                            class="pa-0 ma-0 white--text"
                            block
                            large
                            @click="openFile"
                          >
                            Change Avatar
                          </v-btn>
                        </div>
                      </v-expand-transition>
                    </v-avatar>
                  </v-hover>
                  <v-hover v-else>
                    <v-avatar slot-scope="{ hover }" size="150px">
                      <v-img :src="user.avatar" :alt="user.name">
                        <v-expand-transition>
                          <div
                            v-if="hover"
                            class="
                              d-flex
                              teal
                              darken-1
                              v-card--reveal--img
                              transition-fast-in-fast-out
                            "
                            style="height: 100%"
                          >
                            <v-btn
                              color="primary"
                              class="pa-0 ma-0 white--text"
                              block
                              large
                              @click="openFile"
                            >
                              Change Avatar
                            </v-btn>
                          </div>
                        </v-expand-transition>
                      </v-img>
                    </v-avatar>
                  </v-hover>
                  <input
                    ref="avatar"
                    type="file"
                    name="avatar"
                    style="display: none"
                    @change="updateAvatar"
                  />
                </v-col>
                <v-col cols="12" md="9">
                  <validation-observer
                    v-slot="{ handleSubmit, invalid, reset }"
                  >
                    <v-form
                      @submit.prevent="handleSubmit(updateInformation)"
                      @reset.prevent="reset"
                    >
                      <div class="pos-r">
                        <v-subheader> General Information </v-subheader>
                        <v-divider />
                        <v-btn
                          fab
                          small
                          dark
                          icon
                          :class="readonly ? 'primary' : 'pink'"
                          bottom
                          right
                          absolute
                          @click="readonly = !readonly"
                        >
                          <v-icon>
                            mdi-{{ readonly ? 'pencil' : 'close-circle' }}
                          </v-icon>
                        </v-btn>
                      </div>

                      <v-container class="pa-2" grid-list-xl>
                        <v-row>
                          <v-col cols="12" md="6">
                            <b-text
                              v-model="user.first_name"
                              rules="required"
                              append-icon="mdi-account"
                              label="First Name"
                              required
                              :disabled="readonly"
                            />
                          </v-col>
                          <v-col cols="12" md="6">
                            <b-text
                              v-model="user.last_name"
                              rules="required"
                              append-icon="mdi-account"
                              label="Last Name"
                              required
                              :disabled="readonly"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-container class="pa-2" grid-list-xl>
                        <v-row>
                          <v-col cols="12" md="6">
                            <b-text
                              v-model="user.email"
                              rules="required|email"
                              append-icon="mdi-email"
                              label="Email"
                              type="email"
                              required
                              :disabled="readonly"
                            />
                          </v-col>
                          <v-col cols="12" md="6">
                            <b-text
                              v-model="user.phone"
                              append-icon="mdi-phone"
                              label="Phone"
                              :disabled="readonly"
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-card-actions v-if="!readonly">
                        <v-spacer />
                        <v-btn
                          :loading="loading"
                          :disabled="invalid"
                          color="primary"
                          type="submit"
                        >
                          Update
                        </v-btn>
                      </v-card-actions>
                    </v-form>
                  </validation-observer>
                  <div
                    v-if="
                      $store.state.settings.password_edit_enabled === 'true'
                    "
                  >
                    <validation-observer
                      v-slot="{ handleSubmit, invalid, reset }"
                    >
                      <v-form
                        @submit.prevent="handleSubmit(updateUserPassword)"
                        @reset.prevent="reset"
                      >
                        <div class="pos-r">
                          <v-subheader> Reset Password</v-subheader>
                          <v-divider />
                          <v-btn
                            fab
                            small
                            dark
                            icon
                            :class="password_readonly ? 'primary' : 'pink'"
                            bottom
                            right
                            absolute
                            @click="password_readonly = !password_readonly"
                          >
                            <v-icon>
                              mdi-{{
                                password_readonly ? 'pencil' : 'close-circle'
                              }}
                            </v-icon>
                          </v-btn>
                        </div>
                        <v-container class="pa-2" grid-list-xl>
                          <v-row>
                            <v-col cols="12" md="6">
                              <b-password
                                ref="password"
                                v-model="user.password"
                                rules="required|min:8"
                                prepend-icon="mdi-lock"
                                label="Password"
                                required
                                :disabled="password_readonly"
                              />
                            </v-col>
                            <v-col cols="12" md="6">
                              <b-password
                                v-model="user.password_confirmation"
                                rules="required"
                                prepend-icon="mdi-lock"
                                label="Confirm Password"
                                required
                                :disabled="password_readonly"
                              />
                            </v-col>
                          </v-row>
                        </v-container>
                        <v-card-actions v-if="!password_readonly">
                          <v-spacer />
                          <v-btn
                            :loading="password_updating"
                            :disabled="invalid"
                            color="primary"
                            type="submit"
                          >
                            Update
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </validation-observer>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'MyProfile',
  data() {
    return {
      user: {
        id: 0,
        name: '',
        email: '',
        mobile: '',
        address: '',
        phone: '',
        avatar: null,
        password: '',
        password_confirmation: '',
      },
      loading: false,
      password_updating: false,
      show: false,
      readonly: true,
      reset_password_enabled: true,
      password_readonly: true,
    };
  },
  computed: {
    authUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    // get user
    this.getUser();

    window.getApp.$on('REFRESH_PAGE_CONTENT', () => this.getUser());
  },
  beforeDestroy() {
    window.getApp.$off('REFRESH_PAGE_CONTENT');
  },
  methods: {
    async getUser() {
      try {
        const { data } = await this.$axios.$get(`user/${this.authUser.id}`);
        this.user = data;
        this.user.password = '';
        this.user.password_confirmation = '';
      } catch (e) {
        this.$router.push('/');
      }
    },
    openFile() {
      this.$refs.avatar.click();
    },
    async updateAvatar(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      const formData = new FormData();
      formData.append('avatar', files[0]);
      this.loading = true;
      try {
        const { message, user } = await this.$axios.$post(
          `update-user-avatar/${this.authUser.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        this.loading = false;
        // update user
        this.user = user;
        // fetch user
        // await this.$auth.fetchUser();
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
    // update info into server
    async updateInformation() {
      this.loading = true;
      try {
        const { message, user } = await this.$axios.$patch(
          `update-user-info/${this.authUser.id}`,
          this.user
        );
        this.loading = false;
        this.readonly = true;

        // update user
        this.user = user;
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
    // update password into server
    async updateUserPassword() {
      this.password_updating = true;
      try {
        const { message, user } = await this.$axios.$patch(
          `update-user-password/${this.authUser.id}`,
          this.user
        );

        this.password_updating = false;
        this.password_readonly = true;
        // update user
        this.user = user;

        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
        // this.errors.clear('password_form');
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
