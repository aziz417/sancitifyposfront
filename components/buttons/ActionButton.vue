<template>
  <v-card-actions>
    <v-spacer />
    <v-btn color="secondary" outlined @click="$router.back()"> Cancel </v-btn>
    <!-- <v-btn color="warning" outlined type="reset"> Reset </v-btn> -->
    <v-btn
      :loading="loading"
      :disabled="error"
      color="primary"
      type="submit"
      outlined
    >
      {{ title }}
    </v-btn>
  </v-card-actions>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Submit',
    },
  },
};
</script>
