const admin = require("firebase-admin");

const serviceAccount = require("./calendar-activities-firebase-adminsdk-34gqk-be2d4f17fd.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.messaging().send({
    token: "",
    notification: {
        title: "Title",
        body: "Message",
        imageUrl: "...",
    }
});