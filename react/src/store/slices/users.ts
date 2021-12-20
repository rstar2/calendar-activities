import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { QuerySnapshot } from "firebase/firestore";

import firebase, { parseDocs } from "../../lib/firebase";
import { AppThunk } from "..";
import User from "../../types/User";
import { Func } from "../../types/globals";

// First, define the reducer and action creators via `createSlice`
export const usersSlice = createSlice({
  name: "users",
  initialState: {
    isLoading: false,
    users: [] as User[],
  },
  reducers: {
    usersLoading(state) {
      state.isLoading = true;
    },
    usersSet(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
  },
});

// Inferred type: {isLoading: boolean, users: User[]}
export type UsersState = ReturnType<typeof usersSlice.getInitialState>;

// Destructure the plain action creators
const { usersLoading, usersSet } = usersSlice.actions;

export default usersSlice.reducer;

const collection = firebase.collection(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.REACT_APP_FIREBASE_COLL_USERS!
);

// Define a plain redux-thunk that dispatches those action creators
// Meant to be used only once
export const usersSubscribe = (): AppThunk<Func> => (dispatch) => {
  // just for tests
  //   setInterval(() => {
  //     const max = Math.floor(Math.random() * 5);

  //     const users: User[] = Array.from({ length: max }).map((_, i) => ({ id: i + "", name: "name" + i }));
  //     dispatch(usersSet(users));
  //   }, 5000);

  if (usersSubscribe["__subscribers"] === 0) {
    dispatch(usersLoading());
    // register to Firebase db changes ONLY ONCE
    usersSubscribe["__unsubscribe"] = firebase.onSnapshot(
      collection,
      (snapshot: QuerySnapshot) => {
        const users = parseDocs(snapshot) as User[];
        dispatch(usersSet(users));
      }
    );
  }

  usersSubscribe["__subscribers"]++;

  return () => {
    usersSubscribe["__subscribers"]--;

    // if this is the last users subscription then unsubscribe form Firebase
    if (usersSubscribe["__subscribers"] === 0) {
      usersSubscribe["__unsubscribe"]?.();
      usersSubscribe["__unsubscribe"] = undefined;
    }
  };
};
usersSubscribe["__subscribers"] = 0;
usersSubscribe["__unsubscribe"] = undefined as Func | undefined;

export function selectUserId(
  { users }: UsersState,
  id: string
): User | undefined {
  return users.find((user) => user.id === id);
}
