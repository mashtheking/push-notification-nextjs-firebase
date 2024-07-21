import firebaseAdmin from "firebase-admin";

export const admin = (() => {
  try {
    return firebaseAdmin.app();
  } catch (error) {
    return firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      }),
    });
  }
})();
