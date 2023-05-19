<template>
  <validation-provider
    v-slot="{ errors, valid }"
    :name="$attrs.label"
    :rules="rules"
    :vid="$attrs.vid"
  >
    <v-text-field
      v-model="innerValue"
      :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
      :type="show ? 'text' : 'password'"
      prepend-icon="mdi-lock"
      :error-messages="errors"
      :success="valid"
      v-bind="$attrs"
      v-on="$listeners"
      @click:append="show = !show"
    ></v-text-field>
  </validation-provider>
</template>

<script>
export default {
  name: 'BPassword',
  props: {
    rules: {
      type: [Object, String],
      default: '',
    },
    // must be included in props
    value: {
      type: null,
      default: null,
    },
  },
  data: () => ({
    innerValue: '',
    show: false,
  }),
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit('input', newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
};
</script>
