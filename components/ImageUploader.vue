<template>
  <v-card class="image-upload" outlined>
    <input
      ref="image"
      type="file"
      name="image"
      accept="image/*"
      @change="updateImage($event)"
    />
    <template v-if="innerValue === ''">
      <v-card-text
        class="d-flex flex-column justify-center align-center relative w-100"
        @click="$refs.image.click()"
      >
        <v-icon large>mdi-cloud-upload</v-icon>
        <h3>Upload Cover Image</h3>
      </v-card-text>
    </template>
    <template v-else>
      <v-card-text class="d-flex justify-center align-center relative w-100">
        <v-btn icon dark class="ma-0 remove pink" @click.stop="removeImage">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-img :src="innerValue" aspect-ratio="1.78"></v-img>
      </v-card-text>
    </template>
    <v-card-title v-if="error" class="py-0">
      <v-alert
        border="bottom"
        color="pink darken-1"
        dark
        class="w-100"
        dismissible
      >
        {{ error }}
      </v-alert>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'ImageUploader',
  props: {
    // must be included in props
    value: {
      type: null,
      default: null,
    },
    errors: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    innerValue: '',
    error: null,
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
    errors(val) {
      if (val) {
        Object.keys(val).forEach((item) => {
          if (item === 'image') {
            this.error = val[item][0];
          }
        });
      } else {
        this.error = null;
      }
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
  methods: {
    // update image
    updateImage(event) {
      const file = event.target.files[0];
      this.$emit('updateImage', file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.innerValue = URL.createObjectURL(file);
      };
    },
    // remove image
    removeImage() {
      this.innerValue = '';
      this.error = null;
      this.$emit('removeImage', '');
    },
  },
};
</script>
