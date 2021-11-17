import firebase from "./firebase";

import logger from "../lib/logger";

export default {
  /**
   * @param {Function} authChangeCallback
   */
  init(authChangeCallback) {
    logger.info("Auth init");

    // this is used for 2 things:
    // 1. Initial Firebase auth state fetching, as after page-reload
    // 2. As a result to 'createUserWithEmailAndPassword', 'signInWithEmailAndPassword', 'signOut'
    //    so technically the commits after their results are not needed, but let them stay for now
    // const _this = this; // firebase calls this callback inside a Promise so this inside it is the Promise itself
    this.onAuthStateChanged((user) => {
      let promise = Promise.resolve(null);

      // allow only "verified" users
      if (user) {
        // if (user.emailVerified) {
        // auth user - wait to get the custom claims
        promise = user.getIdTokenResult().then((idTokenResult) => {
          // this is like s JWT token (aud, iss, iat, exp, email, sub, user_id)
          // and custom ones like 'admin'
          logger.info("Logged in user claims", idTokenResult.claims);

          // store the custom claims directly onto the stored user object (currently 'admin' only)
          user.claims = idTokenResult.claims;
          return user;
        });
        // } else {
        //   _this.logout();
        // }
      }

      // notify the callback for the auth
      promise.then(authChangeCallback);
    });
  },

  /**
   * Listen to auth change events
   * @param {(user: import("firebase/auth").User) => void} callback
   */
  onAuthStateChanged(callback) {
    return firebase.onAuthStateChanged(callback);
  },

  /**
   * Logout
   * @return {Promise<void>}
   */
  async logout() {
    return firebase.signOut();
  },

  /**
   * Return current user's ID
   * @return {string}
   */
  getUserId() {
    const user = firebase.getCurrentUser();

    if (!user) throw new Error("Not logged in user");

    return user.uid;
  },
};
