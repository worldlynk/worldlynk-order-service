const admin = require('firebase-admin');
const { firebaseServiceAccount } = require('./index');

// Parse the JSON string from the environment variable
const serviceAccount = JSON.parse(firebaseServiceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

module.exports = { firestore };
