/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js",
);

/** @type {ServiceWorkerGlobalScope & typeof globalThis} */
const sw = self;
/** @type {import("firebase/compat/app").default} */
const f = firebase;

const app = f.initializeApp({
    apiKey: "AIzaSyDC1H8Eum8Jl8VXTCVw_oG1GtSKLWU4-Jc",
  authDomain: "mziki-africa.firebaseapp.com",
  projectId: "mziki-africa",
  storageBucket: "mziki-africa.appspot.com",
  messagingSenderId: "1019501721189",
  appId: "1:1019501721189:web:450c39a16b553371f1788c",
  measurementId: "G-84NDQVLD5N"
});
const messaging = f.messaging(app);

if (!f.messaging.isSupported()) {
  throw new Error(
    "Firebase cloud messaging feature is not supported on this browser.",
  );
}

messaging.onBackgroundMessage((payload) => {
  sw.registration.showNotification(payload.notification?.title || "", {
    body: payload.notification?.body,
    icon: payload.notification?.icon,
  });
});
