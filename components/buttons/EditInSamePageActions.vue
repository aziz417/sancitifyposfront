<template>
  <div>
    <v-btn
      v-if="editBtnShow"
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
      :to="to"
      nuxt
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
    to: {
      type: String,
      default: '/',
    },
    update: {
      type: String,
      default: '',
    },
    deleteAction: {
      type: String,
      default: '',
    },
    editBtnShow: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    // emit delete event
    deleteItem() {
      this.$emit('deleteItem');
    },
  },
};
</script>
