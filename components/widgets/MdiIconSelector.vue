<template>
  <div id="iconSelector">
    <v-text-field
      v-model="icon"
      label="Select Icon"
      placeholder="Enter Icon Path or Select Icon"
      outlined
      hide-details
    >
      <template #append>
        <v-btn class="primary" title="Upload File" @click.stop="dialog = true">
          <v-icon> mdi-emoticon </v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <v-dialog
      ref="dialog"
      v-model="dialog"
      persistent
      :return-value.sync="icon"
      max-width="400"
    >
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            prepend-icon="mdi-label"
            label="Search Icon"
            clearable
          />
        </v-card-title>
        <v-card-text style="height: 300px">
          <scrollbar style="height: 260px">
            <v-btn-toggle v-model="icon" mandatory style="flex-wrap: wrap">
              <v-btn v-for="(item, i) in allIcons" :key="i" :value="item.icon">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">
                      {{ item.icon }}
                    </v-icon>
                  </template>
                  <span>{{ item.key }}</span>
                </v-tooltip>
              </v-btn>
            </v-btn-toggle>
          </scrollbar>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="primary" outlined @click="loadMore"> Load More </v-btn>
          <v-spacer />
          <v-btn color="warning" outlined @click.stop="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click.stop="$refs.dialog.save(icon)">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';
import * as mdiIcons from '@mdi/js';

export default {
  name: 'MdiIconSelector',
  props: {
    // must be included in props
    value: {
      type: null,
      default: null,
    },
  },
  data() {
    return {
      dialog: false,
      icon: null,
      search: null,
      allIcons: [],
      startIndex: 0,
      endIndex: 50,
    };
  },
  computed: {
    icons() {
      return Object.keys(mdiIcons)
        .sort()
        .map((key) => {
          return {
            key: key.substr(3),
            icon: mdiIcons[key],
          };
        });
    },
  },
  watch: {
    // Handles internal model changes.
    icon(newVal) {
      this.$emit('input', newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.icon = newVal;
    },
    search: debounce(function (val) {
      if (val) {
        this.allIcons = this.icons.filter((icon) =>
          icon.key.toLowerCase().includes(val.toLowerCase())
        );
      } else {
        this.allIcons = this.icons.slice(this.startIndex, this.endIndex);
      }
    }, 500),
  },
  created() {
    if (this.value) {
      this.icon = this.value;
    }
  },
  mounted() {
    Object.keys(mdiIcons)
      .slice(this.startIndex, this.endIndex)
      .sort()
      .forEach((key) => {
        this.allIcons.push({
          key: key.substr(3),
          icon: mdiIcons[key],
        });
      });
  },
  methods: {
    loadMore() {
      this.startIndex = this.endIndex;
      this.endIndex = this.startIndex + 50;
      Object.keys(this.icons)
        .slice(this.startIndex, this.endIndex)
        .sort()
        .forEach((key) => {
          this.allIcons.push({
            key: key.substr(3),
            icon: this.icons[key],
          });
        });
    },
  },
};
</script>
