import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppThunk } from "..";
import firebase from "../../lib/firebase";
import { Func } from "../../types/globals";
import { add as addNotification } from "../slices/notifications";

// First, define the reducer and action creators via `createSlice`
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isKnown: false,
    isAuth: false,
  },
  reducers: {
    authSet(state, action: PayloadAction<boolean>) {
      state.isKnown = true;
      state.isAuth = action.payload;
    },
  },
});

export default authSlice.reducer;

// Destructure the plain action creators
const { authSet } = authSlice.actions;

/**
 * An async action (plain redux-thunk) for subscribing to firebase auth changes.
 * Meant to be used only once
 */
export const authSubscribe = (): AppThunk<Func> => (dispatch) => {
  if (authSubscribe["__called"]) {
    console.warn(
      "authSubscribe() is already called, but it's designed to be called only once"
    );
    return () => {
      /* nothing */
    };
  }
  authSubscribe["__called"] = true;

  // register to Firebase auth changes
  return firebase.onAuthStateChanged((user) => {
    dispatch(authSet(!!user));
  });
};
authSubscribe["__called"] = false;

export const authLogin =
  (email: string, password: string): AppThunk =>
  async (dispatch, getState) => {
    if (getState().auth.isAuth) {
      console.warn("Already logged in");
      return;
    }
    try {
      await firebase.signIn(email, password);
      dispatch(
        addNotification({
          options: {
            variant: "success",
          },
          message: "Successfully logged in",
        })
      );
    } catch (e) {
      dispatch(
        addNotification({
          options: {
            variant: "error",
          },
          message: "Failed to login in",
        })
      );
    }
  };

export const authLogout = (): AppThunk => async (dispatch, getState) => {
  if (!getState().auth.isAuth) {
    console.warn("Already logged out");
    return;
  }
  try {
    await firebase.signOut();
    dispatch(
      addNotification({
        options: {
          variant: "success",
        },
        message: "Successfully logged out",
      })
    );
  } catch (e) {
    dispatch(
      addNotification({
        options: {
          variant: "error",
        },
        message: "Failed to log out",
      })
    );
  }
};
