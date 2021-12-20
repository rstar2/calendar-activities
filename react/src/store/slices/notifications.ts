import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OptionsObject, SnackbarKey } from "notistack";

interface NotificationAdd {
  key?: SnackbarKey;
  message: string;
  // this is the snackbar options,
  // in current case of notistack it will be of OptionsObject type
  options?: OptionsObject;
}
export interface Notification extends NotificationAdd {
  key: SnackbarKey;
  dismissed?: true;
}

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [] as Notification[],
  reducers: {
    /**
     * Reducer/action for adding/enqueuing a notification,
     * intended to be called from components/services, etc...
     */
    add: (state, action: PayloadAction<NotificationAdd>) => {
      let notification: Notification;
      if (action.payload.key !== undefined)
        notification = action.payload as Notification;
      else
        notification = {
          ...action.payload,
          key: "" + Date.now() + Math.random(),
        };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.push(notification);
    },
    /**
     * Reducer/action for closing a notification by key or all notifications if no key is provided,
     * intended to be called from components/services, etc...
     */
    dismiss: (state, action: PayloadAction<SnackbarKey | undefined>) => {
      if (action.payload === undefined) {
        // dismiss all
        state.forEach((notification) => (notification.dismissed = true));
      }

      // dismiss a single one
      const notification = state.find(
        (notification) => notification.key === action.payload
      );
      if (notification) notification.dismissed = true;
    },
    /**
     * Reducer/action for removing a notification,
     * intended to be called from the notifications provider when a notification is finally "closed"
     */
    remove: (state, action: PayloadAction<SnackbarKey>) => {
      // Construct a new result array immutably and return it
      return state.filter(
        (notification) => notification.key !== action.payload
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, dismiss, remove } = notificationsSlice.actions;

export default notificationsSlice.reducer;
