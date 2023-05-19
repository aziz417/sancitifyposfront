<template>
  <v-speed-dial
    v-model="fab"
    direction="left"
    transition="slide-x-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        color="primary"
        :title="$t('case_statement.export')"
        small
        dark
        fab
      >
        <v-icon>mdi-file-export</v-icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    <v-btn
      :loading="csv"
      :disabled="csv"
      color="info"
      fab
      small
      title="CSV"
      @click="downloadFile('csv')"
    >
      <v-icon>mdi-file-export</v-icon>
    </v-btn>
    <v-btn
      :loading="xlsx"
      :disabled="xlsx"
      color="info"
      fab
      small
      title="Excel"
      @click="downloadFile('xlsx')"
    >
      <v-icon>mdi-database-export</v-icon>
    </v-btn>
    <v-btn
      :loading="pdf"
      :disabled="pdf"
      color="info"
      fab
      small
      title="PDF"
      @click="downloadFile('pdf')"
    >
      <v-icon>mdi-file-pdf</v-icon>
    </v-btn>
    <v-btn
      :loading="print"
      :disabled="print"
      color="info"
      fab
      small
      title="Print"
      @click="printTable"
    >
      <v-icon>mdi-printer</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'ExportButtons',
  props: {
    fileUrl: {
      type: String,
      default: 'user',
    },
    collections: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      fab: false,
      csv: false,
      xlsx: false,
      pdf: false,
      print: false,
    };
  },
  methods: {
    // download files
    async downloadFile(format) {
      this[format] = true;
      try {
        const response = await this.$axios({
          url: `${this.fileUrl}&format=${format}`,
          method: 'GET',
          responseType: 'blob',
        });
        this[format] = false;
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
        this[format] = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    // print
    async printTable() {
      if (this.collections.length) {
        try {
          const response = await this.$axios({
            url: `${process.env.API_URL}/export/case-statement-report-print?case_ids=${this.collections}`,
            method: 'GET',
            responseType: 'blob',
          });

          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: 'application/pdf' })
          );
          window.open(url, '_blank');
        } catch (e) {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            e.response && e.response.data.message
          );
        }
      } else {
        this.$store.commit('APP_WARNING', 'Please select any row');
      }
    },
  },
};
</script>
