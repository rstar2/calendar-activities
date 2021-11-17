<template>
  <v-dialog v-model="active" max-width="450">
    <FirebaseUI @signin="active = false" />
  </v-dialog>
</template>

<script>
import FirebaseUI from "./FirebaseUI.vue";

export default {
  components: { FirebaseUI },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  // use the 'show' property for v-model
  model: {
    prop: "show",
    event: "close",
  },
  computed: {
    active: {
      get() {
        return this.show;
      },
      set(isActive) {
        this.$emit("close", isActive);
      },
    },
  },
};
</script>
