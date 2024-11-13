const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKeys.json'); // Replace with the path to your service account JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;