import { useEffect } from "react";

import { SnackbarKey, useSnackbar } from "notistack";

import { useAppDispatch, useAppSelector } from "../store";
import { remove as removeNotification } from "../store/slices/notifications";

let displayed: SnackbarKey[] = [];

const storeDisplayed = (key: SnackbarKey) => {
  displayed = [...displayed, key];
};

const removeDisplayed = (key: SnackbarKey) => {
  displayed = displayed.filter((aKey) => aKey !== key);
};

const useNotifier = (): void => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const dispatch = useAppDispatch();
  const notifications = useAppSelector((store) => store.notifications);

  useEffect(() => {
    notifications.forEach(
      ({ key, message, options = {}, dismissed = false }) => {
        if (dismissed) {
          // dismiss snackbar using notistack
          closeSnackbar(key);
          return;
        }

        // do nothing if snackbar is already displayed
        if (displayed.includes(key)) return;

        // display snackbar using notistack
        enqueueSnackbar(message, {
          key,
          ...options,
          onClose: (event, reason, myKey) => {
            if (options.onClose) {
              options.onClose(event, reason, myKey);
            }
          },
          onExited: (event, myKey) => {
            // remove this snackbar from redux store
            dispatch(removeNotification(myKey));
            removeDisplayed(myKey);
          },
        });

        // keep track of snackbars that we've displayed
        storeDisplayed(key);
      }
    );
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);
};

export default useNotifier;
