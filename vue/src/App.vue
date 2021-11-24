<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <Navbar />
    </v-app-bar>

    <v-main>
      <!-- <v-container fluid> -->

      <!-- Add a spinner until Firebase is "initialized" and user is known to be logged in or out -->
      <div v-if="!$store.state.authInitialized" class="d-flex justify-center align-center spinner">
        <Spinner
          :speed="1.0"
          :size="120"
          :line-size="15"
          :line-fg-color="$vuetify.theme.themes[$vuetify.theme.dark ? 'dark' : 'light'].primary"
        />
      </div>
      <template v-else>
        <v-fade-transition mode="out-in">
          <!-- Use keep-alive as the main views are not needed to be recreated each time -->
          <keep-alive>
            <router-view />
          </keep-alive>
        </v-fade-transition>
      </template>

      <!-- </v-container> -->

      <!-- These components are necessary for the notifications/confirmations plugin to work -->
      <!-- <Notifications /> -->
      <!-- <Confirmations /> -->
    </v-main>
  </v-app>
</template>

<script>
import Spinner from "vue-simple-spinner";
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Spinner,
    Navbar,
  },
  data: () => ({
    //
  }),

  mounted() {
    this.$store.dispatch("load");
  },
};
</script>

<style>
.spinner {
  height: 100%;
}

/* 
* {
  background-color: var(--v-primary2-base);
  color: var(--v-primary2Text-base);
}
*/
</style>
