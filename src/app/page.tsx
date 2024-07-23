"use client";

import SendNotificationForm from "@/components/SendNotificationForm";
import SubscribeButton from "@/components/SubscribeButton";
import SubscriptionList from "@/components/SubscriptionList";
import { SendNotificationFormContextProvider } from "@/hooks/useContextSendNotificationForm";
import { SubscriptionListContextProvider } from "@/hooks/useContextSubscriptionList";
import { Container, Grid } from "@mui/material";

export default function Page() {
  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        background: "linear-gradient(to right, #4facfe, #00f2fe)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
      }}
    >
      <Grid container spacing={4} maxWidth="lg">
        <SendNotificationFormContextProvider>
          <Grid item xs={12} md={7} order={{ xs: 2, md: 1 }}>
            <SendNotificationForm />
          </Grid>

          <Grid item xs={12} md={5} order={{ xs: 1, md: 2 }}>
            <Grid container spacing={4}>
              <SubscriptionListContextProvider>
                <Grid item xs={12}>
                  <SubscribeButton />
                </Grid>

                <Grid item xs={12}>
                  <SubscriptionList />
                </Grid>
              </SubscriptionListContextProvider>
            </Grid>
          </Grid>
        </SendNotificationFormContextProvider>
      </Grid>
    </Container>
  );
}
