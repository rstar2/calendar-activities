<template>
  <v-list dense subheader>
    <v-subheader>Activities (current/cycle/total)</v-subheader>

    <v-list-item v-for="activity in activities" :key="activity.id">
      <v-list-item-avatar>
        <v-icon v-text="getIcon(activity)"></v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ getUser(activity) }} - {{ activity.name }} - {{ activity.current }}/{{ activity.cycle }}/{{
            activity.total
          }}
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
