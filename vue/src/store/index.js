import Vue from "vue";
import Vuex from "vuex";

import auth from "../services/auth";
import db from "../services/db";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // whether the app is initialized it's authUser state - set only once
    /* boolean */ authInitialized: false,

    // the authenticated user,
    /* firebase.User like */ authUser: null,

    /* Array */ users: [],
    /* Array */ activities: [],
  },
  getters: {
    /**
     * @param {Vuex.State} state
     * @return {Boolean}
     */
    isAuth(state) {
      return !!state.authUser;
    },
    /**
     * @param {Vuex.State} state
     * @return {(id: string) => string}
     */
    getUserName(state, getters) {
      return (id) => {
        let user;
        if (state.authUser && id === getters.authId) user = state.authUser;
        else user = state.users.find((user) => user.id === id);
        return user && user.name;
      };
    },
  },
  mutations: {
    /**
     * @param {Vuex.State} state
     */
    authInitialized(state) {
      // if (state.authInitialized) this.$logger.warn("Store's 'auth' state is already initialized");
      state.authInitialized = true;
    },
    /**
     * @param {Vuex.State} state
     * @param {import("firebase/auth").User?} user "fixed" firebase.User instance enhanced with a 'claims' Object prop
     */
    authUser(state, user) {
      state.authUser = user;
    },

    /**
     * Set/replace all activities
     * @param {Vuex.State} state
     * @param {{id: string, name: string}[]} users
     */
    usersSet(state, users) {
      // set the users
      state.users = users;
    },
    /**
     * Set/replace all activities
     * @param {Vuex.State} state
     * @param {{id: string, current: number, total: number}[]} activities
     */
    activitiesSet(state, activities) {
      // set the activities
      state.activities = activities;
    },

    /**
     * Update a specific activity
     * @param {Vuex.State} state
     * @param {{id: string, current: number, total: number}} activity
     */
    activityUpdate(state, activity) {
      // update a specific activity
      const { id } = activity;
      const item = state.activities.find((item) => item.id === id);
      if (item) {
        // update/merge
        Object.assign(item, activity);

        // other ways
        // this.todos[3].text = "changedItemProperty";
        // Object.assign(this.todos[3], { text: "changedItemProperty" });
        // Vue.set(this.todos, 3, { text: "changedItemProperty" });

        // just a note: - state.activities[3] = { text: "changedItem" } will not work
      }
    },
  },
  actions: {
    /**
     * Logout current user
     * @return {Promise}
     */
    async logout() {
      return auth.logout();
    },

    /**
     * Load activities and users
     * @param {Vuex.Commit} commit
     * @return {Promise}
     */
    async load({ commit }) {
      // concurrently load both activities and users
      return Promise.all([db.activitiesLoad(), db.usersLoad()]).then(([activities, users]) => {
        commit("activitiesSet", activities);
        commit("usersSet", users);
      });
    },

    /**
     * Reset an activity's cycle
     * @param {Vuex.ActionContext} context
     * @param {string} id
     * @return {Promise}
     */
    async activityReset(context, id) {
      await db.activityReset(id);
    },

    /**
     * Increase activity's current count
     * @param {Vuex.ActionContext} context
     * @param {string} id
     * @param {number} count
     * @return {Promise}
     */
    async activityIncrease(context, { id, count }) {
      await db.activityIncrease(id, count);
    },
  },
});

export default store;

// Initialize the Auth service
auth.init((user) => {
  store.commit("authInitialized");
  store.commit("authUser", fixUser(user));
});

// init the DB - like Activities/Users/.... - and listen for real-time updates
db.init({
  activitiesChangeCallback: (activities) => {
    store.commit("activitiesSet", activities);
  },
  usersChangeCallback: (users) => {
    store.commit("usersSet", users);
  },
});

/**
 * NOTE: don't pass the firebase.User as payload as it doesn't work in Vuex strict mode
 * as Firebase internally changes some of its user's (e.g. payload's) props,
 * so create a new object with needed props
 * @param {import("firebase/auth").User?} user firebase.User instance enhanced with a 'claims' Object prop
 */
const fixUser = (user) => {
  return (
    user && {
      id: user.uid,
      email: user.email,
      claims: user.claims,

      // the firebase.User has 'displayName' and 'photoURL' (from the auth service),
      // but will 'sync' them with the users DB also and so will use 'name' and 'photoURL'
      name: user.displayName,
      photoURL: user.photoURL,
    }
  );
};
