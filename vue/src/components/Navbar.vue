<template>
  <!-- Make it a nav tag -->
  <v-row tag="nav" class="flex-nowrap">
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink"
        contain
        src="../assets/logo.png"
        transition="scale-transition"
        width="40"
      />
    </div>

    <!-- Not used for now -->
    <!-- <router-link to="/" class="mr-2 pa-1">Home</router-link>
    <router-link to="/about" class="mr-2 pa-1">About</router-link>
    <router-link v-if="isAuth" to="/profile" class="ml-2 pa-1">Profile</router-link> -->

    <v-spacer></v-spacer>

    <template v-if="authInitialized">
      <v-btn v-if="isAuth" text @click="logout">
        <span class="mr-2">Logout</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn v-else text @click.stop="showDialogLogin">
        <span class="mr-2">SignIn</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </template>

    <!--
      The .sync modifier can also be used with v-bind
      when using an object to set multiple props at once:

      <text-document v-bind.sync="doc"></text-document>
      This passes each property in the doc object (e.g. title) as an individual prop,
      then adds v-on update listeners for each one.
      -->
    <DialogLogin v-model="dialogLogin" />
  </v-row>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import DialogLogin from "./DialogLogin.vue";

export default {
  components: {
    DialogLogin,
  },
  data() {
    return {
      dialogLogin: false,
    };
  },
  computed: {
    ...mapState(["authInitialized", "authUser"]),
    ...mapGetters(["isAuth"]),
  },
  methods: {
    showDialogLogin() {
      this.dialogLogin = true;
    },
    logout() {
      this.$store.dispatch("logout").catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        this.$logger.warn(errorMessage);
        // this.$notify({ text: errorMessage, type: "error" });
      });
    },
  },
};
</script>

<style scoped>
/*
nav a {
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #42b983;
}
*/
</style>
