import { useState, useEffect } from "react";

import { QuerySnapshot } from "firebase/firestore";

import firebase, { parseDocs } from "../lib/firebase";

import User from "../types/User";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const collection = firebase.collection(process.env.REACT_APP_FIREBASE_COLL_USERS!);

/**
 *
 * @returns latest users reactive
 */
export default function useUsers(): User[] {
  const [users, setUsers] = useState([] as User[]);

  useEffect(() => {
    firebase.onSnapshot(collection, (snapshot: QuerySnapshot) => {
      const users = parseDocs(snapshot);

      setUsers(users as User[]);
    });
  }, []);

  return users;
}
