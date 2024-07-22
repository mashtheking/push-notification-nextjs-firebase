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
  apiKey: "AIzaSyAcNnKSuGgtm_N5Pt10nfgLguWWtZfiGNo",
  authDomain: "push-notification-20240707.firebaseapp.com",
  projectId: "push-notification-20240707",
  storageBucket: "push-notification-20240707.appspot.com",
  messagingSenderId: "886761309595",
  appId: "1:886761309595:web:1505ab7641ff55e4c14d3e",
  measurementId: "G-P38MVXH8X0",
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
