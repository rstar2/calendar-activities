import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  type: "info" | "success" | "error";
  text: string;
}

type NotificationState = {
  notification?: Notification;
};

// NOTE: Redux requires that we write all state updates immutably,
// by making copies of data and updating the copies.
// However, Redux Toolkit's createSlice and createReducer APIs use Immer inside
// to allow us to write "mutating" update logic that becomes correct immutable updates.
export const notificationsSlice = createSlice({
  name: "counter",
  initialState: {
    notification: undefined,
  } as NotificationState,
  reducers: {
    add: (state, action: PayloadAction<Notification>) => {
      state.notification = action.payload;
    },
    remove: (state) => {
      state.notification = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, remove } = notificationsSlice.actions;

export default notificationsSlice.reducer;
