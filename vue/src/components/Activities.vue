<template>
  <v-list dense subheader>
    <v-subheader>Activities (current/total/cycle)</v-subheader>

    <v-list-item v-for="activity in activities" :key="activity.id">
      <v-list-item-avatar>
        <v-icon v-text="getIcon(activity)"></v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ getUser(activity) }} - {{ activity.name }} - {{ getCounts(activity) }}
        </v-list-item-title>
      </v-list-item-content>

      <template v-if="isAuth">
        <v-list-item-icon>
          <v-btn icon @click="increment(activity)" :disabled="isDisabled(activity)">
            <v-icon>mdi-numeric-positive-1</v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item-icon>
          <v-btn icon @click="reset(activity)" :disabled="isDisabled(activity)">
            <v-icon>mdi-restore</v-icon>
          </v-btn>
        </v-list-item-icon>
      </template>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      updating: {},
    };
  },
  computed: {
    ...mapState(["activities"]),
    ...mapGetters(["isAuth"]),
  },
  methods: {
    /**
     * @param {string} user
     */
    getUser({ user: id }) {
      return this.$store.getters.getUserName(id) ?? "Anonymous";
    },
    /**
     * @param {number} current
     * @param {number} total
     * @param {number} [cycle]
     */
    getCounts({ current, total, cycle }) {
      const counts = [current];
      if (total) counts.push(total);
      if (cycle) counts.push(cycle);
      return counts.join(" / ");
    },
    /**
     * @param {string} type
     */
    getIcon({ type }) {
      switch (type) {
        case "climbing":
          return "🧗";
        case "horse-riding":
          return "🏇";
        case "dance":
          return "💃";
        case "karate":
          return "🥷";
        case "swimming":
          return "🏊‍♀️";
        case "music":
          return "🎵";
      }
      return "mdi-gesture-tap-button";
    },
    /**
     * @param
     */
    isDisabled({ id }) {
      return !!this.updating[id];
    },

    /**
     * @param {string} id
     */
    async reset({ id }) {
      console.log("reset", id);

      // this.updating[id] = true; is not reactive so use: Vue.set() or this.$set
      this.$set(this.updating, id, true);
      await this.$store.dispatch("activityReset", id);
      this.$set(this.updating, id, false);
    },

    /**
     * @param {string} id
     */
    async increment({ id }) {
      console.log("increment", id);

      this.$set(this.updating, id, true);
      await this.$store.dispatch("activityIncrease", { id, count: 1 });
      this.$set(this.updating, id, false);
    },
  },
};
</script>

<style scoped>
.v-icon {
  color: unset;
}
</style>
