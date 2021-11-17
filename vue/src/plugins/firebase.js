import Vue from "vue";

import firebase from "../services/firebase";

export default firebase;

/**
 * The plugin mimics the vuetify plugin installation,
 * still simplified - no need to allow for more instances than one
 */
Vue.use(function install(Vue) {
  if (install.installed) return;
  install.installed = true;

  Vue.mixin({
    beforeCreate() {
      const options = this.$options;

      if (options.firebase) {
        // so this is the root component, e.g 'this' is actually the new Vue({})
        // options.firebase.init(this);
        this.$firebase = options.firebase;
        Vue.$firebase = options.firebase;
      } else {
        this.$firebase = options.parent && options.parent.$firebase;
      }
    },
  });
});
