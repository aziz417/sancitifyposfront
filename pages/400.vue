<template>
  <v-layout align-center justify-center row>
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
  </v-layout>
</template>

<script>
export default {
  layout: 'error-layout',
};
</script>
