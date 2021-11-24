import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export const themeLight = {
  primary: colors.lightBlue,
  secondary: colors.grey.darken1,
  accent: colors.pink.darken1,
  error: colors.red.accent3,
  background: colors.indigo.lighten5,
  info: colors.teal.darken1,
};

export default new Vuetify({
  theme: {
    dark: true,
    // currently Vuetify don't allow changing/setting text colors
    // if wanted to use control using CSS props the Vuetify will create for each specified
    // theme's variant (like primary, primary2, etc...) so it can be used in a CSS
    // like '''background-color: var(--v-primary2-base); color: var(--v-primary2Text-base);''' for instance
    options: { customProperties: true }, //add this
    themes: {
      light: themeLight,
      dark: {
        primary: colors.red.darken4,
        info: colors.teal.lighten1,
        anchor: colors.grey.darken4,
        // primary2: colors.indigo.base, //add this
        // primary2Text: colors.shades.white,
      },
    },
  },
});
