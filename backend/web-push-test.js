const webPush = require("web-push");

// const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
// const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
// const VAPID_BASE_URL = process.env.VAPID_BASE_URL;

const VAPID_PRIVATE_KEY = "BlHfkhQx-SV96RTT7vCgsPl9zEuYDsF7cbLwy6yP5w8";
const VAPID_PUBLIC_KEY = "BLv4h2DHSnpPg_11PrNnsNdVHQ2lazq-IXEhh5aKFDgj6CIr76daUlD1jYRBvYX5GAvjahBHYn0RyASoj5oe0iw";
const VAPID_BASE_URL = "mailto:rstar2@abv.bg";

const subscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/eQq02pz9Nrs:APA91bFVNrFrl22V4nV1W38YYQhI1j6WBcJ1T81mPA4DSjNHa4FxMS6IM3hT7yMB8R5dYmDu-dgBJyQ76lw9_3ue19qpYgEFMvvJ0r_tH7JCeauOBEjAoIa4InxOXbidPE6IYYzhtKc6",
  expirationTime: null,
  keys: {
    p256dh: "BLQy9af1uste-NbprF4Wp7fPRInRZt8vGtohsbvcRsA1A127nPX_6DpWJUwuQOl6gES9EZf2fnoYd3JVY1jPU48",
    auth: "hOF-a4A8rL2pHWOCxldEIw",
  },
};

webPush.setVapidDetails(VAPID_BASE_URL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

/**
 * Send Push notifications to the subscribed user
 * @param {string} userID
 * @param {{}|string} message
 */
function sendToUser(userID, message) {
  const subscriptions = [subscription];

  subscriptions.forEach((subscription) => {
    sendNotification(userID, subscription, message);
  });
}

/**
 * @param {string} userID
 * @param {PushSubscription} subscription
 * @param {{}|string} message
 */
function sendNotification(userID, subscription, message) {
  console.log("Push Application Server - Notification send to", userID, subscription.endpoint);
  webPush
    .sendNotification(subscription, typeof message === "string" ? message : JSON.stringify(message))
    .then(() => {
      console.log("Push Application Server - Notification sent to", subscription.endpoint);
    })
    .catch((error) => {
      console.log("ERROR in sending Notification, endpoint will be removed", subscription.endpoint, error);
    });
}

// JUST TEST
sendToUser("tester", {
  title: "Title",
  body: "Message",
  image: "/images/demos/cat-image.jpg",
  icon: "/images/demos/icon-512x512.png",
  badge: "/images/demos/badge-128x128.png",
  actions: [
    {
      action: "coffee-action",
      title: "Coffee",
      type: "button",
      icon: "/images/demos/action-1-128x128.png",
    },
    {
      action: "doughnut-action",
      type: "button",
      title: "Doughnut",
      icon: "/images/demos/action-2-128x128.png",
    },
  ],
});
