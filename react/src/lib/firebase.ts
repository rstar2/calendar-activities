/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Import the functions you need from the SDKs you need

// firebase 9+ and firebaseui 6
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  Firestore,
  CollectionReference,
  Query,
  QuerySnapshot,
  Unsubscribe,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  Auth,
  User,
  NextOrObserver,
} from "firebase/auth";
import {
  getFunctions,
  httpsCallable,
  Functions,
  HttpsCallable,
} from "firebase/functions";
import { getMessaging, Messaging } from "firebase/messaging";

// import * as firebaseui from "firebaseui";

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
};

class Firebase {
  private readonly messaging: Messaging;
  private readonly db: Firestore;
  private readonly functions: Functions;
  private readonly auth: Auth;
  //   private readonly ui: firebaseui.auth.AuthUI;

  constructor(firebaseConfig: FirebaseConfig) {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    this.messaging = getMessaging(app);
    this.db = getFirestore(app);
    this.functions = getFunctions(app);
    this.auth = getAuth(app);

    // this.ui = new firebaseui.auth.AuthUI(this.auth);
  }

  // ---------- Functions ------------

  /**
   * Get a HTTP callable function
   * @param {string} nameFn
   */
  httpsCallable(nameFn: string): HttpsCallable {
    return httpsCallable(this.functions, nameFn);
  }

  // ---------- Firestore ------------

  collection(nameCol: string): CollectionReference {
    return collection(this.db, nameCol);
  }

  async getDocs(query: Query): Promise<QuerySnapshot> {
    return getDocs(query);
  }

  onSnapshot(
    query: Query,
    onNext: (snapshot: QuerySnapshot) => void,
  ): Unsubscribe {
    return onSnapshot(query, onNext);
  }

  // ---------- Auth ------------

  onAuthStateChanged(onNext: NextOrObserver<User>): Unsubscribe {
    return onAuthStateChanged(this.auth, onNext);
  }

  async signIn(email: string, password: string): Promise<void> {
    // just try to sign-in - no matter the result is Promise<UserCredential>
    return signInWithEmailAndPassword(this.auth, email, password).then();
  }

  async signOut(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser(): User | undefined {
    return this.auth.currentUser ?? undefined;
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain: import.meta.env.VITE_FIREBASE_API_KEY!,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID!,
  appId: import.meta.env.VITE_FIREBASE_APP_ID!,
};

// create instance of the firebase service
export default new Firebase(firebaseConfig);

// utilities

export type Doc = Readonly<{
  id: string;
  [key: string]: unknown;
}>;

/**
 * Parse all users/activities
 */
export const parseDocs = (snapshot: QuerySnapshot): Doc[] => {
  const docs: Doc[] = [];
  snapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });
  return docs;
};
