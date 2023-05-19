<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="icon"
    persistent
    scrollable
    max-width="400px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="icon"
        label="Select Icon"
        append-icon="mdi-emoticon"
        readonly
        v-on="on"
      />
    </template>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-icon="mdi-label"
          label="Search Icon"
          clearable
        />
      </v-card-title>
      <v-card-text height="300px">
        <v-btn-toggle v-model="icon" mandatory style="flex-wrap: wrap">
          <v-btn v-for="(item, i) in filteredIcons" :key="i" :value="item.name">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">
                  {{ `mdi-${item.name}` }}
                </v-icon>
              </template>
              <span>{{ item.name }}</span>
            </v-tooltip>
          </v-btn>
        </v-btn-toggle>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn color="primary" @click.stop="loadMore"> Load More </v-btn>
        <v-spacer />
        <v-btn text color="primary" @click.stop="modal = false"> Cancel </v-btn>
        <v-btn text color="primary" @click.stop="$refs.dialog.save(icon)">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { debounce } from 'lodash-es';

export default {
  name: 'IconSelector',
  data() {
    return {
      modal: false,
      search: '',
      icon: '',
      icons: [],
      filteredIcons: [],
      startIndex: 0,
      endIndex: 32,
    };
  },
  watch: {
    icon(val) {
      this.$emit('icon-selected', `mdi-${val}`);
    },
    search: debounce(function (val) {
      if (val) {
        this.filteredIcons = this.icons.filter((icon) =>
          icon.name.toLowerCase().includes(val.toLowerCase())
        );
      } else {
        this.filteredIcons = this.icons.slice(this.startIndex, this.endIndex);
      }
    }, 500),
  },
  mounted() {
    this.getIcons();
  },
  methods: {
    async getIcons() {
      try {
        const data = await this.$axios.$get(
          `${this.$config.appUrl}/material-icons.json`
        );
        this.icons = data;
        this.filteredIcons = data.slice(this.startIndex, this.endIndex);
      } catch (err) {
        console.log(err);
      }
    },
    loadMore() {
      const startIndex = this.filteredIcons.length;
      const endIndex = startIndex + this.endIndex;
      const filteredIcons = this.icons.slice(startIndex, endIndex);
      filteredIcons.forEach((val) => this.filteredIcons.push(val));
    },
  },
};
</script>
