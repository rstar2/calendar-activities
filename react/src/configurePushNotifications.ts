import firebase from "./lib/firebase.ts";

// it's created in the Firebase console for the project
// Project settings -> Cloud Messaging -> Web Push certificates -> Generate Key pair
const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as
  | string
  | undefined;

let swRegResolve: (swRegistration: ServiceWorkerRegistration) => void;
let swRegReject: () => void;
const swRegistrationPromise = new Promise(
  (
    aSwRegResolve: (swRegistration: ServiceWorkerRegistration) => void,
    aSwRegReject: () => void,
  ) => {
    swRegResolve = aSwRegResolve;
    swRegReject = aSwRegReject;
  },
);

export const notificationsSupported =
  "Notification" in window && navigator.serviceWorker;

/**
 * This must be called (and thus configured) before
 * any "other" module importing the other exported functions
 */
export default function config(swReg?: ServiceWorkerRegistration) {
  if (!swReg) {
    console.warn("Push Messaging is not available");
    swRegReject();
    return;
  }
  if (!vapidPublicKey) {
    console.warn("Push Messaging is not configured");
    swRegReject();
    return;
  }

  console.log("Configure Push Notifications");

  // resolve the "waiting promise"
  swRegResolve(swReg);
}

/**
 * Request/Check permission to use Notification API and if granted configure Push Notifications.
 */
export function createSubscription(): Promise<void> {
  if (!notificationsSupported)
    return Promise.reject(new Error("Client Notifications not supported"));

  console.log("Check create/created subscription");

  return requestNotificationPermission()
    .then(() => swRegistrationPromise)
    .then(async (swReg) => {
      // this will also return current returned Push subscription if any
      // Permissions and subscribe()
      //There is one side effect of calling subscribe(). If your web app doesn't have permissions for showing notifications
      // at the time of calling subscribe(), the browser will request the permissions for you.
      // This is useful if your UI works with this flow, but if you want more control  stick to the Notification.requestPermission() API.
      const subscription = await swReg.pushManager.subscribe({
        // The userVisibleOnly parameter is basically an admission that you will show a notification every time a push is sent.
        // At the time of writing this value is required and must be true.
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(vapidPublicKey!),
      });
      return { subscription, swReg };
    })
    .then(({ subscription, swReg }) => {
      console.log("User IS subscribed.");

      updateSubscriptionOnServer(swReg, subscription);
    })
    .catch((error) => {
      console.error("User is NOT subscribed because of", error);
      throw error; // rethrow the same rejected error
    });
}

// export function removeSubscription(): Promise<boolean> {
//   // NOTE: this assumes hasPermission() has been called
//   if (!pushSubscription) return Promise.resolve(true);

//   return pushSubscription.unsubscribe().then((result) => {
//     updateSubscriptionOnServer(undefined, undefined, pushSubscription);
//     pushSubscription = undefined;
//     return result;
//   });
// }

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function requestNotificationPermission(): Promise<void> {
  return new Promise((resolve, reject) => {
    // NOTE: the Promise API is the new way but if we want to support old callback style API
    // we have to implement both
    const permissionPromise = Notification.requestPermission((result) => {
      // old callback Notification API
      resolve(result);
    });

    // check if new Promise NotificationAPI
    if (permissionPromise) {
      permissionPromise.then(resolve, reject);
    }
  }).then((permission) => {
    if (permission !== "granted") {
      throw new Error("Client Notifications not granted");
    }
  });
}

/**
 * Update user's subscription on the server - add new, remove old
 */
async function updateSubscriptionOnServer(
  swReg: ServiceWorkerRegistration,
  newSubscription?: PushSubscription,
  oldSubscription?: PushSubscription,
) {
  // TODO: send newSubscription to server if the common Valid `web-push` is used
  console.log(newSubscription, oldSubscription);

  // TODO: send fcmToken to server if the `firebase-admin` is used
  const fcmToken = await firebase.getMassagingToken(swReg, vapidPublicKey!);
  console.log(fcmToken);
}
