import {
  getToken as fcmGetToken,
  onMessage as fcmOnMessage,
  getMessaging,
  MessagePayload,
  NextFn,
  Observer,
  Unsubscribe,
} from "firebase/messaging";
import { app } from "./app";

export type Handler = Unsubscribe | null;

export const messaging = getMessaging(app);

export const onMessage = (
  handler: NextFn<MessagePayload> | Observer<MessagePayload>,
) => fcmOnMessage(messaging, handler);

export const getToken = (
  serviceWorkerRegistration?: ServiceWorkerRegistration,
) =>
  fcmGetToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
    serviceWorkerRegistration,
  });
