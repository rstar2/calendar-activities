import {
  createSlice,
  PayloadAction /* , createAsyncThunk  */,
} from "@reduxjs/toolkit";

import { QuerySnapshot } from "firebase/firestore";

import firebase, { parseDocs } from "../../lib/firebase";
import { add as addNotification } from "../slices/notifications";
import { AppThunk } from "..";
import Activity from "../../types/Activity";
import { Func } from "../../types/globals";

// First, define the reducer and action creators via `createSlice`
export const activitiesSlice = createSlice({
  name: "activities",
  initialState: {
    isLoading: false,
    activities: [] as Activity[],
  },
  reducers: {
    activitiesLoading(state) {
      state.isLoading = true;
    },
    activitiesSet(state, action: PayloadAction<Activity[]>) {
      state.activities = action.payload;
    },
  },
});

// Destructure the plain action creators
const { activitiesLoading, activitiesSet } = activitiesSlice.actions;

export default activitiesSlice.reducer;

const collection = firebase.collection(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.REACT_APP_FIREBASE_COLL_ACTIVITIES!
);

// the Firebase Firestore DB is protected from unauthorized add/update/delete
// so use a Firebase Callable Functions
const activitiesAddFn = firebase.httpsCallable("activitiesAdd");
const activitiesResetFn = firebase.httpsCallable("activitiesReset");

// 1. One way - Define a plain redux-thunk that dispatches those action creators
export const activitiesSubscribe = (): AppThunk<Func> => (dispatch) => {
  if (activitiesSubscribe["__subscribers"] === 0) {
    dispatch(activitiesLoading());
    // register to Firebase db changes ONLY ONCE
    activitiesSubscribe["__unsubscribe"] = firebase.onSnapshot(
      collection,
      (snapshot: QuerySnapshot) => {
        const activities = parseDocs(snapshot) as Activity[];
        dispatch(activitiesSet(activities));
      }
    );
  }

  activitiesSubscribe["__subscribers"]++;

  return () => {
    activitiesSubscribe["__subscribers"]--;
    if (activitiesSubscribe["__subscribers"] === 0) {
      activitiesSubscribe["__unsubscribe"]?.();
      activitiesSubscribe["__unsubscribe"] = undefined;
    }
  };
};
activitiesSubscribe["__subscribers"] = 0;
activitiesSubscribe["__unsubscribe"] = undefined as Func | undefined;

// 2. Second way - use createAsyncThunk
// export const fetchActivities = createAsyncThunk(
//     'articles/fetchActivities',
//     async (id: number) => {
//       const data = await fakeAPI.articles.show(id)
//       // Normalize the data so reducers can responded to a predictable payload.
//       // Note: at the time of writing, normalizr does not automatically infer the result,
//       // so we explicitly declare the shape of the returned normalized data as a generic arg.
//       const normalized = normalize<
//         any,
//         {
//           articles: { [key: string]: Article }
//           users: { [key: string]: Author }
//           comments: { [key: string]: Comment }
//         }
//       >(data, articleEntity)
//       return normalized.entities
//     }
//   )

export const activityReset =
  (id: string): AppThunk =>
  async (dispatch, getState) => {
    if (!getState().auth.isAuth) {
      console.warn("Already logged out");
      return;
    }
    try {
      await activitiesResetFn({ id }).then((result) => result.data);

      dispatch(
        addNotification({
          options: {
            variant: "success",
          },
          message: "Successfully reset activity",
        })
      );
    } catch (e) {
      dispatch(
        addNotification({
          options: {
            variant: "error",
          },
          message: "Failed to reset activity",
        })
      );
    }
  };

export const activityIncrement =
  (id: string, count = 1): AppThunk =>
  async (dispatch, getState) => {
    if (!getState().auth.isAuth) {
      console.warn("Already logged out");
      return;
    }
    try {
      await activitiesAddFn({ id, count }).then((result) => result.data);

      dispatch(
        addNotification({
          options: {
            variant: "success",
          },
          message: "Successfully incremented activity",
        })
      );
    } catch (e) {
      dispatch(
        addNotification({
          options: {
            variant: "error",
          },
          message: "Failed to increment activity",
        })
      );
    }
  };
