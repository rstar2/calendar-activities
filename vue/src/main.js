import Vue from "vue";

import App from "./App.vue";

import router from "./router";
import store from "./store";

import vuetify from "./plugins/vuetify";
import firebase from "./plugins/firebase";

import "./registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  router,
  store,

  vuetify,
  firebase,
  render: (h) => h(App),
}).$mount("#app");

// test if the env variables work ok
console.log("test", process.env.VUE_APP_TEST_MODE);
