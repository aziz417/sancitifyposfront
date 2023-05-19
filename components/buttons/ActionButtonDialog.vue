<template>
  <v-card-actions>
    <v-spacer />
    <v-btn color="warning" class="black--text" @click.stop="$emit('close')">
      Cancel
    </v-btn>
    <v-btn :loading="loading" :disabled="error" color="primary" type="submit">
      Save
    </v-btn>
  </v-card-actions>
</template>

<script>
export default {
  name: 'ActionButtonDialog',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
