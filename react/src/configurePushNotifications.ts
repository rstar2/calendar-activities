import firebase from "./lib/firebase.ts";

// it's created in the Firebase console for the project
// -> Cloud Messaging -> Web Push certificates -> Generate Key pair
const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as
  | string
  | undefined;

/**
 * This must be called (and thus configured) before
 * any "other" module importing the other exported functions
 */
export default function config(swReg?: ServiceWorkerRegistration) {
  if (!swReg) return console.warn("Push Messaging is not available");
  if (!vapidPublicKey) return console.warn("Push Messaging is not configured");

  console.log("Configure Firebase Push Notifications");

  firebase.configurePushNotifications(swReg, vapidPublicKey);
}
