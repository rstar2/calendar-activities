import React from "react";

import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";

import { useAppSelector, useAppDispatch } from "../store";
import { remove } from "../store/slices/notifications";

export default function Notifications(): React.ReactElement {
  const notification = useAppSelector((state) => state.notifications.notification);
  const dispatchApp = useAppDispatch();

  function handleClose(event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) {
    if (reason === "clickaway") return;

    // dispatch action to the store to "remove" the notification
    dispatchApp(remove());
  }

  // currently only one notification/snackbar at a time can be shown
  // TODO: make it work with multiple notifications
  //  https://codesandbox.io/s/github/iamhosseindhv/notistack/tree/master/examples/redux-example?file=/useNotifier.js
  return (
    <Snackbar open={!!notification} autoHideDuration={3000} onClose={handleClose}>
      {notification && (
        <Alert elevation={6} variant="filled" color={notification.type} onClose={handleClose}>
          {notification.text}
        </Alert>
      )}
    </Snackbar>
  );
}
