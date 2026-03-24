const functions = require("firebase-functions");

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const functionsConfig = functions.config();

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
// NOTE: the 'firebase' options are by default present in the functions config object
// but others should have been set as the environment variables, like for 'functionsConfig.cloudinary'
//      Configuring of environment variables in Firebase function is "ugly" and only through the CLI like:
//      firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"
//      Keep in mind that only lowercase characters are accepted in keys - so 'apikey', cannot name it 'apiKey'
//      still '_' is allowed so 'api_key' is allowed

// These are actually the mapped environment variables
// VUE_APP_FIREBASE_COLL_USERS and VUE_APP_FIREBASE_COLL_ACTIVITIES
// that are set using the firebase-env.js utility
const { collusers, collactivities } = functionsConfig.db;

// eslint-disable-next-line no-unused-vars
const users = db.collection(collusers);
const activities = db.collection(collactivities);

// exports.hello = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

/**
 * This is HTTPS callable function
 *
 * Increase an activity
 */
exports.activityIncrease = functions.https.onCall(async (data, context) => {
  checkAuthorized(context);

  functions.logger.info("ActivityIncrease:", data);

  const { id, count } = data;

  const activity = await activities
    .doc(id)
    .get()
    .then((docSnapshot) => docSnapshot.data());

  let current = activity.current !== undefined ? activity.current + count : undefined;
  if (current !== undefined && activity.cycle) current = current % activity.cycle;

  let total = activity.total !== undefined ? activity.total + count : undefined;

  await activities.doc(id).set(
    {
      current,
      total,
    },
    { merge: true },
  );
  return true;
});

/**
 * This is HTTPS callable function
 *
 * Decrease an activity
 */
exports.activityDecrease = functions.https.onCall(async (data, context) => {
  checkAuthorized(context);

  functions.logger.info("ActivityDecrease:", data);

  const { id, count } = data;

  const activity = await activities
    .doc(id)
    .get()
    .then((docSnapshot) => docSnapshot.data());

  let left = activity.left !== undefined ? activity.left - count : undefined;
  if (left !== undefined && activity.cycle) left = ((left % activity.cycle) + activity.cycle) % activity.cycle;

  let total = activity.total !== undefined ? activity.total + count : undefined;

  await activities.doc(id).set(
    {
      left,
      total,
    },
    { merge: true },
  );
  return true;
});

/**
 * This is HTTPS callable function
 *
 * Reset activity's cycle
 */
exports.activityReset = functions.https.onCall(async (data, context) => {
  checkAuthorized(context);

  functions.logger.info("ActivitiesReset:", data);

  const { id, newCycle } = data;

  const activity = await activities
    .doc(id)
    .get()
    .then((docSnapshot) => docSnapshot.data());

  const cycle = newCycle !== undefined ? newCycle : activity.cycle;
  if (cycle === undefined) throw new Error("Cannot reset non-cycling activity");

  await activities.doc(id).set(
    {
      current: activity.current !== undefined ? 0 : undefined,
      left: activity.left !== undefined ? cycle : undefined,
      cycle,
    },
    { merge: true },
  );
  return true;
});

/**
 * This is HTTPS callable function
 *
 * Update an activity's properties
 */
exports.activityUpdate = functions.https.onCall(async (data, context) => {
  checkAuthorized(context);

  functions.logger.info("ActivityUpdate:", data);

  const { id, updates } = data;

  if (!id) {
    throw new functions.https.HttpsError("invalid-argument", "Activity ID is required");
  }

  if (!updates || typeof updates !== "object") {
    throw new functions.https.HttpsError("invalid-argument", "Updates object is required");
  }

  const activityDoc = await activities.doc(id).get();
  if (!activityDoc.exists) {
    throw new functions.https.HttpsError("not-found", "Activity not found");
  }

  // Validate: user can only update their own activities
  //   const activity = activityDoc.data();
  //   if (activity.user !== context.auth.uid) {
  //     throw new functions.https.HttpsError("permission-denied", "You can only update your own activities");
  //   }

  // Build update object with only allowed fields
  const allowedFields = ["name", "type", "total", "cycle", "left", "current"];
  const updateData = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  }

  await activities.doc(id).set(updateData, { merge: true });
  return true;
});

/**
 *
 * @param {functions.https.CallableContext} context
 */
function checkAuthorized(context) {
  // To ensure the client gets useful error details, return errors from a callable by throwing
  // (or returning a Promise rejected with) an instance of functions.https.HttpsError.
  // The error has a code attribute that can be one of the values listed at functions.https.HttpsError.
  // The errors also have a string message, which defaults to an empty string.
  // They can also have an optional details field with an arbitrary value.
  // If an error other than HttpsError is thrown from your functions, your client instead receives
  // an error with the message INTERNAL and the code internal.

  // Authentication / user information is automatically added to the request.
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError("unauthenticated", "The function must be called " + "while authenticated.");
  }
  // const uid = context.auth.uid;

  // validate attributes if necessary
  //   if (!(typeof text === 'string') || text.length === 0) {
  //     // Throwing an HttpsError so that the client gets the error details.
  //     throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
  //         'one arguments "text" containing the message text to add.');
  //   }
}
