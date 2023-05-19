<template>
  <div id="mediaAssetDialog">
    <v-container grid-list-xl fluid>
      <v-row>
        <v-col>
          <v-card min-height="200">
            <v-row justify="center">
              <v-col cols="12" sm="6">
                <v-file-input
                  v-model="files"
                  :loading="loading"
                  label="Images/Files"
                  placeholder="Select files to upload..."
                  multiple
                  show-size
                  counter
                  chips
                  @change="updateItems(files)"
                />
              </v-col>
            </v-row>
            <v-card-text v-if="items.length">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Type</th>
                      <th class="text-left">Size</th>
                      <th class="text-left">Progress</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in items" :key="i">
                      <td>{{ item.file.name }}</td>
                      <td>{{ item.file.type }}</td>
                      <td>{{ fileSize(item.file.size) }}</td>
                      <td>
                        <v-progress-linear
                          v-model="item.progress"
                          background-opacity="0.3"
                          height="20"
                          rounded
                          stream
                          striped
                          color="light-blue"
                        >
                          <strong>{{ Math.ceil(item.progress) }}%</strong>
                        </v-progress-linear>
                      </td>
                      <td class="text-center">
                        <v-btn
                          icon
                          fab
                          x-small
                          color="pink"
                          @click="removeFile(i)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-divider />
            <v-row justify="center" class="mt-5">
              <v-col cols="12" sm="6" class="text-center">
                <v-btn color="secondary" large outlined @click="clearAll">
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  type="button"
                  outlined
                  large
                  :loading="loading"
                  @click="uploadAll"
                >
                  Upload
                  <v-icon right>mdi-cloud-upload</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="10">
          <v-card>
            <v-tabs v-model="tab">
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab v-for="(item, index) in media" :key="index">
                {{ index }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item v-for="(item, category) in media" :key="category">
                <template v-if="category === 'Audio'">
                  <v-container fluid>
                    <scrollbar class="media-scrollbar">
                      <v-row>
                        <v-col
                          v-for="audio in item"
                          :key="audio.id"
                          class="d-flex child-flex"
                          cols="12"
                          sm="3"
                        >
                          <v-card>
                            <v-sheet
                              color="cyan lighten-3"
                              height="300"
                              class="d-flex justify-center align-center"
                            >
                              <audio controls :src="audio.url">
                                Your browser does not support the
                                <code>audio</code> element.
                              </audio>
                            </v-sheet>
                            <v-card-actions class="justify-center">
                              <v-btn
                                :data-clipboard-text="audio.url"
                                color="accent"
                                outlined
                              >
                                Copy Link
                              </v-btn>
                              <v-btn
                                color="primary"
                                outlined
                                @click="$emit('use', audio)"
                              >
                                Use It
                              </v-btn>
                              <v-btn
                                color="info"
                                outlined
                                @click="file = audio"
                              >
                                Details
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </v-row>
                    </scrollbar>
                  </v-container>
                </template>
                <template v-else-if="category === 'Videos'">
                  <v-container fluid>
                    <scrollbar class="media-scrollbar">
                      <v-row>
                        <v-col
                          v-for="video in item"
                          :key="video.id"
                          class="d-flex child-flex"
                          cols="12"
                          sm="3"
                        >
                          <v-card>
                            <v-sheet
                              color="cyan lighten-3"
                              height="300"
                              class="d-flex justify-center align-center"
                            >
                              <video controls :src="video.url" width="100%">
                                Your browser does not support the
                                <code>video</code> element.
                              </video>
                            </v-sheet>
                            <v-card-actions class="justify-center">
                              <v-btn
                                :data-clipboard-text="video.url"
                                color="accent"
                                outlined
                              >
                                Copy Link
                              </v-btn>
                              <v-btn
                                color="primary"
                                outlined
                                @click="$emit('use', video)"
                              >
                                Use It
                              </v-btn>
                              <v-btn
                                color="info"
                                outlined
                                @click="file = video"
                              >
                                Details
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </v-row>
                    </scrollbar>
                  </v-container>
                </template>
                <template v-else-if="category === 'Images'">
                  <v-container fluid>
                    <scrollbar class="media-scrollbar">
                      <v-row>
                        <v-col
                          v-for="image in item"
                          :key="image.id"
                          class="d-flex child-flex"
                          cols="12"
                          sm="3"
                        >
                          <v-card>
                            <v-img
                              :src="image.url"
                              :lazy-src="`https://picsum.photos/id/11/100/60`"
                              aspect-ratio="1"
                              class="grey lighten-2"
                            >
                              <template v-slot:placeholder>
                                <v-row
                                  class="fill-height ma-0"
                                  align="center"
                                  justify="center"
                                >
                                  <v-progress-circular
                                    indeterminate
                                    color="grey lighten-5"
                                  />
                                </v-row>
                              </template>
                            </v-img>
                            <v-card-actions class="justify-center">
                              <v-btn
                                :data-clipboard-text="image.url"
                                color="accent"
                                outlined
                              >
                                Copy Link
                              </v-btn>
                              <v-btn
                                color="primary"
                                outlined
                                @click="$emit('use', image)"
                              >
                                Use It
                              </v-btn>
                              <v-btn
                                color="info"
                                outlined
                                @click="file = image"
                              >
                                Details
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </v-row>
                    </scrollbar>
                  </v-container>
                </template>
                <template v-else>
                  <v-container fluid>
                    <scrollbar class="media-scrollbar">
                      <v-row>
                        <v-col
                          v-for="app in item"
                          :key="app.id"
                          class="d-flex child-flex"
                          cols="12"
                          sm="3"
                        >
                          <v-card>
                            <v-sheet
                              color="cyan lighten-3"
                              height="300"
                              class="d-flex justify-center align-center"
                            >
                              <v-icon size="150">mdi-folder</v-icon>
                            </v-sheet>
                            <v-card-actions class="justify-center">
                              <v-btn
                                :data-clipboard-text="app.url"
                                color="accent"
                                outlined
                              >
                                Copy Link
                              </v-btn>
                              <v-btn
                                color="primary"
                                outlined
                                @click="$emit('use', app)"
                              >
                                Use It
                              </v-btn>
                              <v-btn color="info" outlined @click="file = app">
                                Details
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </v-row>
                    </scrollbar>
                  </v-container>
                </template>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
        <v-col cols="12" sm="2">
          <v-card v-if="file">
            <v-subheader>File Details</v-subheader>
            <v-divider />
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td><strong>Name:</strong></td>
                    <td>{{ file.name }}</td>
                  </tr>
                  <tr>
                    <td><strong>Size:</strong></td>
                    <td>{{ file.size }}</td>
                  </tr>
                  <tr>
                    <td><strong>Type:</strong></td>
                    <td>{{ file.mime_type }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-card-actions class="justify-center">
              <v-btn
                color="primary"
                title="download"
                outlined
                @click="downloadFile(file.id)"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-btn
                color="pink"
                title="delete"
                outlined
                @click="showConfirmDelete"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="copied" top right color="success">
      Link copied!
      <v-btn dark text icon @click.native="copied = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import { humanReadableFileSize } from '@/util';
import Scrollbar from '@/components/Scrollbar';
import { confirmDelete } from '@/plugins/sweetalert';

export default {
  name: 'MediaAssetDialog',
  components: { Scrollbar },
  data() {
    return {
      loading: false,
      downloading: false,
      copied: false,
      language: 'en',
      tab: null,
      file: null,
      files: null,
      items: [],
      breadcrumbs: [
        {
          disabled: false,
          href: 'home',
          link: false,
          text: 'Home',
        },
        {
          disabled: false,
          href: 'assets',
          link: false,
          text: 'Assets',
        },
      ],
      media: [],
    };
  },
  mounted() {
    // initiate clipboard
    const clipboard = new Clipboard('.v-btn');
    clipboard.on('success', (e) => {
      this.copied = true;
      e.clearSelection();
    });
    this.getMedia();
    window.getApp.$on('REFRESH_PAGE_CONTENT', () => this.getMedia());
  },
  beforeDestroy() {
    window.getApp.$off('REFRESH_PAGE_CONTENT');
  },
  methods: {
    updateItems(files) {
      this.items = [];
      for (const file of this.files) {
        this.items.push({
          file,
          progress: 0,
          source: this.$axios.CancelToken.source(),
        });
      }
    },
    // cancel all upload
    clearAll() {
      if (this.items.length) {
        this.items.forEach((item) => {
          item.source && item.source.cancel('Request Canceled!');
        });
      }
      this.files = null;
      this.items = [];
    },
    fileSize(size) {
      return humanReadableFileSize(size);
    },
    removeFile(index) {
      this.items[index].source &&
        this.items[index].source.cancel('Request Canceled!');
      this.files.splice(index, 1);
      this.items.splice(index, 1);
    },
    uploadAll() {
      this.loading = true;
      const requests = [];
      this.items.forEach((item, index) => {
        requests.push(this.upload(item, index));
      });
      Promise.all(requests)
        .then(() => {
          this.loading = false;
          this.getMedia();
          this.files = [];
          this.items = [];
        })
        .catch(() => (this.loading = false));
    },
    // upload files
    async upload(item, index) {
      try {
        const formData = new FormData();

        formData.append('file', item.file);
        const { message } = await this.$axios.$post(
          `${process.env.API_URL}/asset`,
          formData,
          {
            onUploadProgress(event) {
              const { loaded, total } = event;
              item.progress = Math.round((loaded * 100) / total);
            },
            cancelToken: item.source.token,
          }
        );
        this.files.splice(index, 1);
        this.items.splice(index, 1);
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        if (this.$axios.isCancel(err)) {
          this.$store.commit('APP_NETWORK_ERROR', err.message);
        } else if (err.response.status === 422) {
          const { errors } = err.response.data;
          const fields = Object.values(errors);
          for (let i = 0; i < fields.length; i++) {
            for (let j = 0; j < fields[i].length; j++) {
              this.$toasted.global.form_error(fields[i][j]);
            }
          }
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
    // get media
    async getMedia() {
      try {
        const { data } = await this.$axios.$get(`${process.env.API_URL}/file`);

        this.media = data;
      } catch (err) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    // download files
    async downloadFile(file) {
      this.downloading = true;
      try {
        const response = await this.$axios({
          url: `${process.env.API_URL}/file-download/${file}`,
          method: 'GET',
          responseType: 'blob',
        });
        this.downloading = false;
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'unknown';
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          fileName = fileNameMatch[1];
        }
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (e) {
        this.downloading = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    // delete message
    showConfirmDelete() {
      if (this.file) {
        confirmDelete().then((res) => {
          if (res.value) {
            this.deleteFile(this.file.id);
          }
          return false;
        });
      }
    },
    // delete file
    async deleteFile(file) {
      try {
        const { message } = await this.$axios.$delete(
          `${process.env.API_URL}/file/${file}`
        );
        this.file = null;
        this.getMedia();
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
  },
};
</script>
