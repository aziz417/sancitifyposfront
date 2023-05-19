import colors from 'vuetify/lib/util/colors';

export default {
  theme: {
    light: true,
    themes: {
      light: {
        primary: '#58C6E2',
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.darken3,
      },
    },
  },
  icons: {
    iconfont: 'mdi',
  },
};
