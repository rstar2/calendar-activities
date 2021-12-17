import firebase from "./firebase";

import logger from "../lib/logger";

// the Firebase Firestore DB is protected from unauthorized add/update/delete
// so use a Firebase Callable Functions
const activitiesAddFn = firebase.httpsCallable("activitiesAdd");
const activitiesResetFn = firebase.httpsCallable("activitiesReset");

const users = firebase.collection(process.env.VUE_APP_FIREBASE_COLL_USERS);
const activities = firebase.collection(process.env.VUE_APP_FIREBASE_COLL_ACTIVITIES);

const activitiesLoad = {
  realtimeChangeCallback: null,
  realtimeSkippedFirst: false,
};

const usersLoad = {
  realtimeChangeCallback: null,
  realtimeSkippedFirst: false,
};

const initActivitiesRealtime = () => {
  if (activitiesLoad.realtimeChangeCallback) {
    logger.info("Activities: Listen for realtime updates");

    firebase.onSnapshot(activities, (snapshot) => {
      // skip the first snapshot ass we already have the docs
      if (!activitiesLoad.realtimeSkippedFirst) {
        activitiesLoad.realtimeSkippedFirst = true;
        return;
      }

      // this is as if the whole collection is fetched now
      const activitiesDocs = parseDocs(snapshot);
      logger.info(`Activities: Updated ${activitiesDocs.length}`);

      activitiesLoad.realtimeChangeCallback(activitiesDocs);
    });
  }
};

const initUsersRealtime = () => {
  if (usersLoad.realtimeChangeCallback) {
    logger.info("Users: Listen for realtime updates");

    firebase.onSnapshot(users, (snapshot) => {
      // skip the first snapshot ass we already have the docs
      if (!usersLoad.realtimeSkippedFirst) {
        usersLoad.realtimeSkippedFirst = true;
        return;
      }

      // this is as if the whole collection is fetched now
      const usersDocs = parseDocs(snapshot);
      logger.info(`Users: Updated ${usersDocs.length}`);

      usersLoad.realtimeChangeCallback(usersDocs);
    });
  }
};

/**
 * Parse all users/activities
 * @param {import("firebase/firestore").QuerySnapshot} snapshot
 * @returns {Array}
 */
const parseDocs = (snapshot) => {
  const docs = [];
  snapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });
  return docs;
};

export default {
  /**
   * @param {Function} activitiesChangeCallback
   * @param {Function} usersChangeCallback
   */
  init({ activitiesChangeCallback, usersChangeCallback }) {
    logger.info("DB init");

    activitiesLoad.realtimeChangeCallback = activitiesChangeCallback;
    usersLoad.realtimeChangeCallback = usersChangeCallback;
  },

  async usersLoad() {
    return firebase.getDocs(users).then((snapshot) => {
      const usersDocs = parseDocs(snapshot);
      logger.info(`Users: Loaded ${usersDocs.length}`);

      initUsersRealtime();

      return usersDocs;
    });
  },

  /**
   * Get the activities
   * @return {Promise<[]>}
   */
  async activitiesLoad() {
    return firebase.getDocs(activities).then((snapshot) => {
      const activities = parseDocs(snapshot);
      logger.info(`Activities: Loaded ${activities.length}`);

      initActivitiesRealtime();

      return activities;
    });
  },

  /**
   * Increase activity
   * @param {string} id
   * @param {number} count
   * @return {Promise}
   */
  async activityIncrease(id, count = 1) {
    return activitiesAddFn({ id, count }).then((result) => result.data);
  },

  /**
   * Reset activity
   * @param {string} id
   * @return {Promise}
   */
  async activityReset(id) {
    return activitiesResetFn({ id }).then((result) => result.data);
  },
};
