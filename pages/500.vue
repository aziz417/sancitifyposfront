<template>
  <v-layout align-center justify-center row>
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
  </v-layout>
</template>

<script>
export default {
  layout: 'error-layout',
};
</script>
