// Import the functions you need from the SDKs you need

// firebase 9 and firebaseui 6
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getMessaging } from "firebase/messaging";

import * as firebaseui from "firebaseui";

export default class Firebase {
  constructor(firebaseConfig) {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    this._messaging = getMessaging(app);
    this._db = getFirestore(app);
    this._functions = getFunctions(app);
    this._auth = getAuth(app);

    this.ui = new firebaseui.auth.AuthUI(this._auth);
  }

  // ---------- Functions ------------

  /**
   * Get a HTTP callable function
   * @param {string} nameFn
   * @return {import("firebase/functions").HttpsCallable<RequestData, ResponseData>}
   */
  httpsCallable(nameFn) {
    return httpsCallable(this._functions, nameFn);
  }

  // ---------- Firestore ------------

  /**
   * @param {string} nameCol
   * @return {import("firebase/firestore").CollectionReference}
   */
  collection(nameCol) {
    return collection(this._db, nameCol);
  }

  /**
   * @param {import("firebase/firestore").Query} query
   * @return {Promise<import("firebase/firestore").QuerySnapshot>}
   */
  getDocs(query) {
    return getDocs(query);
  }

  /**
   * @param {import("firebase/firestore").Query} query
   * @param {(snapshot: import("firebase/firestore").DocumentSnapshot) => void} onNext
   * @return {import("firebase/firestore").Unsubscribe}
   */
  onSnapshot(query, onNext) {
    return onSnapshot(query, onNext);
  }

  // ---------- Auth ------------

  /**
   * @param {import("firebase/auth").NextOrObserver<import("firebase/auth").User>} onNext
   * @return {import("firebase/auth").Unsubscribe}
   */
  onAuthStateChanged(onNext) {
    return onAuthStateChanged(this._auth, onNext);
  }

  /**
   * @return {Promise<void>}
   */
  signOut() {
    return signOut(this._auth);
  }

  /**
   * @return {import("firebase/auth").User|null}
   */
  getCurrentUser() {
    return this._auth.currentUser;
  }
}