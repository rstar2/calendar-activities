// NOTE: it a valid TypeScript file
/// <reference lib="webworker" />

// export type {}; // needed if no "import ..." in order to assume this file as module

// Default type of `self` is `WorkerGlobalScope & typeof globalThis`
// https://github.com/microsoft/TypeScript/issues/14877
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare const self: ServiceWorkerGlobalScope;

import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

// --------------------------

// Caching

// static cache of the assets defined in in vite.config.ts `workbox.globPatterns: ["**/*.{js,css,html,ico,png,svg}"]`
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// cache the Google Fonts also
// // Google fonts dynamic cache
// registerRoute(
//     /^https:\/\/fonts\.googleapis\.com\/.*/i,
//     new CacheFirst({
//         cacheName: "google-fonts-cache",
//         plugins: [
//             new ExpirationPlugin({maxEntries: 500, maxAgeSeconds: 5184e3}),
//             new CacheableResponsePlugin({statuses: [0, 200]})
//         ]
//     }), "GET");

// --------------------------

// Prompt For Update  (in vite.config.ts `registerType: "prompt"`)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
// NOTE!!! In dev mode to test this "prompt" behavior has to update directly this sw.ts file,
// as the 'self.__WB_MANIFEST' is always [] so any change in any other file will not be "reflected" here

// --------------------------

// Receive push notifications
self.addEventListener("push", function (e) {
  // check if notifications can be shown
  if (!(Notification && Notification.permission === "granted")) {
    // notifications aren't supported or permission not granted!
    console.log("Notifications are not supported or granted");
    return;
  }

  if (!e.data) return;

  console.log("Received PushNotification");

  // assuming data is in JSON format
  const message = e.data.json();
  // assuming data is in plain string format
  // const message = e.data.text();

  e.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      icon: message.icon,
      actions: message.actions,
    }),
  );
});

// Click and open notification
self.addEventListener(
  "notificationclick",
  function (event) {
    event.notification.close();

    if (event.action === "whatever") self.clients.openWindow("/whatever");
  },
  false,
);
