<template>
  <v-layout align-center justify-center row>
    <template v-if="error.statusCode === 404">
      <div class="mr-3 hidden-sm-and-down">
        <img src="~assets/images/errors/404.svg" alt="404" />
      </div>
      <div class="text-md-center">
        <h1>404</h1>
        <h2 class="my-3 headline">Sorry, page not found.</h2>
        <div>
          <v-btn color="primary" nuxt to="/">Go Home</v-btn>
        </div>
      </div>
    </template>
    <template v-if="error.statusCode === 500">
      <div class="mr-3 hidden-sm-and-down">
        <img src="~assets/images/errors/500.svg" alt="500" />
      </div>
      <div class="text-md-center">
        <h1>500</h1>
        <h2 class="my-3 headline">Sorry, the server is down.</h2>
        <div>
          <v-btn color="primary" nuxt to="/">Go Home</v-btn>
        </div>
      </div>
    </template>
    <template v-if="error.statusCode === 403">
      <div class="mr-3 hidden-sm-and-down">
        <img src="~assets/images/errors/403.svg" alt="403" />
      </div>
      <div class="text-md-center">
        <h1>403</h1>
        <h2 class="my-3 headline">Sorry, access denied.</h2>
        <div>
          <v-btn color="primary" nuxt to="/">Go Home</v-btn>
        </div>
      </div>
    </template>
    <template v-if="error.statusCode === 400">
      <div class="mr-3 hidden-sm-and-down">
        <img src="~assets/images/errors/403.svg" alt="400" />
      </div>
      <div class="text-md-center">
        <h1>400</h1>
        <h2 class="my-3 headline">Sorry, bad request.</h2>
        <div>
          <v-btn color="primary" nuxt to="/">Go Home</v-btn>
        </div>
      </div>
    </template>
  </v-layout>
</template>

<script>
export default {
  name: 'Error',
  // eslint-disable-next-line vue/require-prop-types
  props: ['error'],
  layout: 'error-layout',
};
</script>
