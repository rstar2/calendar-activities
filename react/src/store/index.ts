import { configureStore } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ThunkAction } from "redux-thunk";

// import all the slices for the react-toolkit-redux
import notificationsReducer from "./slices/notifications";
import authReducer from "./slices/auth";
import activitiesReducer from "./slices/activities";
import usersReducer from "./slices/users";

// import a service-api for the rtk-query
import { usersApi } from "../services/usersApi";

export const store = configureStore({
  reducer: {
    // 1. as plain slice
    notifications: notificationsReducer,

    // 2. as plain slice with async "side effect" (thunks)
    auth: authReducer,
    activities: activitiesReducer,
    users: usersReducer,

    // 3. using rtk-query - easiest and a lot of customizations, will work in 95% of the use cases
    // Add the generated reducer as a specific top-level slice
    // (name it whatever or use the name as defined in 'reducerPath')
    [usersApi.reducerPath]: usersApi.reducer,
  },

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  // NOTE: Not used currently in this app
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(usersApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself

// Inferred type: {counter: CounterState, userApi: UsersState}
export type AppRootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// type (safe for this app) for any redux-thunk thinks (e.g functions)
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, AnyAction>;

// these are just utility wrappers around the redux userSelector and useDispatch
// that are "typed" for this app's store
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;
