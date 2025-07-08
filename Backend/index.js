const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('./app');

// Initialize Firebase Admin
admin.initializeApp();

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);