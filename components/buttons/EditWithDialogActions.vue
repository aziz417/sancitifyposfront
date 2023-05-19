<template>
  <div class="text-center">
    <v-btn
      v-can="update"
      depressed
      outlined
      icon
      fab
      dark
      color="primary"
      class="mr-0"
      small
      title="Edit"
      @click="editItem"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn
      v-can="deleteAction"
      depressed
      outlined
      icon
      fab
      dark
      color="pink"
      class="mr-0"
      small
      title="Delete"
      @click="deleteItem"
    >
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'EditWithDialogActions',
  props: {
    update: {
      type: String,
      default: '',
    },
    deleteAction: {
      type: String,
      default: '',
    },
  },
  methods: {
    // emit edit event
    editItem() {
      this.$emit('editItem');
    },
    // emit delete event
    deleteItem() {
      this.$emit('deleteItem');
    },
  },
};
</script>
