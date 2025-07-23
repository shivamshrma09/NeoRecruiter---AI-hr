const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('./app');

admin.initializeApp();

exports.api = functions.https.onRequest(app);