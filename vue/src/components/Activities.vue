<template>
  <v-list dense subheader>
    <v-subheader>Activities (current/cycle/total)</v-subheader>

    <v-list-item v-for="activity in activities" :key="activity.id">
      <v-list-item-avatar>
        <v-icon v-text="getIcon(activity)"></v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ activity.type }} - {{ activity.current }}/{{ activity.cycle }}/{{ activity.total }}
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-icon @click="increment(activity)">
        <v-btn icon>
          <v-icon>mdi-numeric-positive-1</v-icon>
        </v-btn>
      </v-list-item-icon>
      <v-list-item-icon @click="reset(activity)">
        <v-btn icon>
          <v-icon>mdi-restore</v-icon>
        </v-btn>
      </v-list-item-icon>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["users", "activities"]),
  },
  methods: {
    /**
     * @param {string} type
     */
    getIcon({ type }) {
      switch (type) {
        case "climbing":
          return "🧗";
        case "horse-riding":
          return "🏇";
      }
      return "mdi-gesture-tap-button";
    },

    /**
     * @param {string} id
     */
    reset({ id }) {
      console.log("reset", id);
      this.$store.dispatch("activityReset", id);
    },

    /**
     * @param {string} id
     */
    increment({ id }) {
      console.log("increment", id);
      this.$store.dispatch("activityIncrease", { id, count: 1 });
    },
  },
};
</script>

<style scoped>
.v-icon {
  color: unset;
}
</style>
