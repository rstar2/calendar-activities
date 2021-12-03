/* eslint-disable no-console */

import { register } from "register-service-worker";

import configurePushNotifications from "./firebase-configurePushNotifications";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready(swRegistration) {
      console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB");

      configurePushNotifications(swRegistration);
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    /**
     * @param {ServiceWorkerRegistration} swRegistration
     */
    updated(swRegistration) {
      console.log("New content is available; please refresh.");

      // tell the waiting server worker to take control (e.g. to skipWaiting())
      // use a request-response pattern
      alert("New version is available - it will auto update");
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        console.log("Done worker.skipWaiting().");
        if (!event.data.error) {
          window.location.reload();
        }
      };
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" }, [messageChannel.port2]);
    },
    offline() {
      console.log("No internet connection found. App is running in offline mode.");
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
}
