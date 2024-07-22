"use client";

import useContextSubscriptionList from "@/hooks/useContextSubscriptionList";
import { getToken, isSupported, onMessage } from "@/lib/firebase/messaging";
import LoadingButton from "@mui/lab/LoadingButton";
import { Card, CardActions, CardHeader } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { MouseEventHandler, useEffect, useState } from "react";

export default function SubscribeButton() {
  const [enableSubscribeButton, setEnableSubscribeButton] =
    useState<boolean>(true);
  const [loadingSubscribeButton, setLoadingSubscribeButton] =
    useState<boolean>(false);
  const [textSubscribeButton, setTextSubscribeButton] =
    useState<string>("Subscribe Now");
  const [token, setToken] = useState<string | undefined>();

  const { getSubscriptionList } = useContextSubscriptionList();

  useEffect(() => {
    (async () => {
      if (!(await isSupported()) || Notification.permission !== "granted") {
        return;
      }

      return onMessage((payload) => {
        enqueueSnackbar(
          `${payload.notification?.title}: ${payload.notification?.body}`,
          { variant: "info" },
        );
      });
    })();
  }, [token]);

  const handleSubscribe: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      setLoadingSubscribeButton(true);
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        enqueueSnackbar(
          "You do not allow the app to show notifications. Please check the notification setting on your browser.",
          { variant: "error" },
        );
        return;
      }
      await navigator.serviceWorker.register("./firebase-messaging-sw.js");
      const token = await getToken(await navigator.serviceWorker.ready);
      setToken(token);
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { token },
        }),
      });
      if (response.status !== 201) {
        throw new Error(
          ((await response.json()) as { message: string })?.message ||
            "Failed to subscribe.",
        );
      }
      enqueueSnackbar("You allow the app to show notifications.", {
        variant: "success",
      });
    } catch (error) {
      // @ts-ignore:next-line
      enqueueSnackbar(error?.message, { variant: "error" });
      console.error(error);
    } finally {
      await getSubscriptionList();
      setEnableSubscribeButton(Notification.permission === "default");
      setLoadingSubscribeButton(false);
      setTextSubscribeButton(
        Notification.permission === "granted" ? "Subscribed" : "Blocked",
      );
    }
  };

  return (
    <Card>
      <CardHeader
        title="Subscribe"
        subheader="Subscribe to receive updates and notifications."
      />
      <CardActions>
        <LoadingButton
          fullWidth
          variant="outlined"
          disabled={!enableSubscribeButton}
          loading={loadingSubscribeButton}
          onClick={handleSubscribe}
        >
          <span>{textSubscribeButton}</span>
        </LoadingButton>
      </CardActions>
    </Card>
  );
}
