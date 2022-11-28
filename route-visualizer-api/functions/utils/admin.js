var admin = require("firebase-admin");

var serviceAccount = {
  "type": process.env.FB_SA_TYPE,
  "project_id": process.env.FB_SA_PROJECT_ID,
  "private_key_id": process.env.FB_SA_PRIVATE_KEY_ID,
  "private_key": process.env.FB_SA_PRIVATE_KEY,
  "client_email": process.env.FB_SA_CLIENT_EMAIL,
  "client_id": process.env.FB_SA_CLIENT_ID,
  "auth_uri": process.env.FB_SA_AUTH_URI,
  "token_uri": process.env.FB_SA_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FB_SA_AUTH_PROVIDER_CERT_URL,
  "client_x509_cert_url": process.env.FB_SA_CLIENT_CERT_URL
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };