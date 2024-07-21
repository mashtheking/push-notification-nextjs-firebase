"use client";

import Popup, { Props as PopupProps } from "@/components/Popup";
import { getToken, onMessage } from "@/lib/firebase/messaging";
import { prisma } from "@/models";
import {
  ContentCopy,
  Description,
  Key,
  Refresh,
  Tag,
  Title,
} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { isSupported } from "firebase/messaging";
import {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { z } from "zod";

export default function Page() {
  const [popup, setPopup] = useState<PopupProps>({
    isOpen: false,
    severity: "info",
    message: "",
  });
  const showPopup = (
    severity: Exclude<PopupProps["severity"], undefined>,
    message: string,
  ) => {
    setPopup({ isOpen: true, severity, message });
  };

  const formSchema = z.object({
    subscription_id: z
      .string()
      .trim()
      .transform((value) => ((value?.length || 0) <= 0 ? undefined : value)),
    title: z.string().trim().min(1),
    body: z.string().trim().min(1),
    tags: z
      .string()
      .trim()
      .transform((value) => ((value?.length || 0) <= 0 ? undefined : value)),
  });
  const [formData, setFormData] = useState<z.output<typeof formSchema>>({
    subscription_id: "",
    title: "",
    body: "",
    tags: "",
  });
  const handleFormChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const [formError, setFormError] = useState<z.ZodFormattedError<
    z.infer<typeof formSchema>,
    string
  > | null>(null);
  const [loadingFormSubmitButton, setLoadingFormSubmitButton] =
    useState<boolean>(false);
  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    try {
      setLoadingFormSubmitButton(true);

      event.preventDefault();

      const {
        success,
        error,
        data: parsedFormData,
      } = formSchema.safeParse(formData);

      setFormError(!success ? error.format() : null);

      if (!success) {
        return;
      }

      const url = parsedFormData.subscription_id
        ? `/api/subscriptions/${parsedFormData.subscription_id}/send-notification`
        : "/api/subscriptions/send-notifications";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notification: {
            title: parsedFormData.title,
            body: parsedFormData.body,
            tags: parsedFormData.tags,
            // image_url: "",
          },
          // webpush: {
          //   fcm_options: {
          //     link: "",
          //   },
          // },
        }),
      });

      if (response.status !== 200) {
        throw new Error("Failed to send notification.");
      }

      showPopup("success", "Notification sent successfully.");
    } catch (error) {
      console.error(error);
      // @ts-ignore:next-line
      showPopup("error", error?.message);
    } finally {
      setLoadingFormSubmitButton(false);
    }
  };

  const [enableSubscribeButton, setEnableSubscribeButton] =
    useState<boolean>(true);
  const [loadingSubscribeButton, setLoadingSubscribeButton] =
    useState<boolean>(false);
  const [textSubscribeButton, setTextSubscribeButton] =
    useState<string>("Subscribe Now");
  const [token, setToken] = useState<string | undefined>();
  const handleSubscribe: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      setLoadingSubscribeButton(true);

      if (!(await isSupported())) {
        return showPopup(
          "error",
          "Subscribe feature is not supported on this browser.",
        );
      }

      const permission = await Notification.requestPermission();

      if (permission === "denied") {
        return showPopup(
          "error",
          "You do not allow the app to show notifications. Please check the notification setting on your browser.",
        );
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
        throw new Error("Failed to subscribe.");
      }

      showPopup("success", "You allow the app to show notifications.");
    } catch (error) {
      console.error(error);
      // @ts-ignore:next-line
      showPopup("error", error?.message);
    } finally {
      await getSubscriptionList();
      setEnableSubscribeButton(Notification.permission === "default");
      setLoadingSubscribeButton(false);
      setTextSubscribeButton(
        Notification.permission === "granted" ? "Subscribed" : "Blocked",
      );
    }
  };

  const [loadingSubscriptionList, setLoadingSubscriptionList] =
    useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<
    Array<prisma.Subscription>
  >([]);
  const getSubscriptionList = useCallback(async () => {
    try {
      setLoadingSubscriptionList(true);
      const response = await fetch("/api/subscriptions");

      if (!response.ok) {
        throw new Error("Failed to get subscription list.");
      }

      const jsonResponse = await response.json();
      setSubscriptions(jsonResponse.data as Array<prisma.Subscription>);
    } catch (error) {
      console.error(error);
      // @ts-ignore:next-line
      showPopup("error", error?.message);
    } finally {
      setLoadingSubscriptionList(false);
    }
  }, []);
  const handleCopySubscriptionId =
    (subscription: prisma.Subscription): MouseEventHandler<SVGSVGElement> =>
    () => {
      navigator.clipboard.writeText(subscription.id);
      setFormData({
        ...formData,
        subscription_id: subscription.id,
      });

      showPopup("success", "Sucessfully copied Subscription ID");
    };

  useEffect(() => {
    getSubscriptionList();
  }, [getSubscriptionList]);

  useEffect(() => {
    (async () => {
      if (!(await isSupported()) || Notification.permission !== "granted") {
        return;
      }

      return onMessage(async (payload) => {
        new Notification(payload.notification?.title || "", {
          body: payload.notification?.body,
          icon: payload.notification?.icon,
        });
      });
    })();
  }, [token]);

  return (
    <>
      <Popup {...popup} onClose={() => setPopup({ isOpen: false })} />
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
          <Grid item xs={12} md={7}>
            <Card sx={{ minWidth: 275 }}>
              <CardHeader title="Send Notification Form" />
              <CardContent>
                <Box
                  component="form"
                  onSubmit={handleFormSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    fullWidth
                    id="subscription_id"
                    label="Subscription ID"
                    name="subscription_id"
                    autoComplete="subscription_id"
                    value={formData.subscription_id}
                    onChange={handleFormChange}
                    error={formError?.subscription_id !== undefined}
                    helperText={formError?.subscription_id?._errors[0]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Key />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    autoComplete="title"
                    autoFocus
                    value={formData.title}
                    onChange={handleFormChange}
                    error={formError?.title !== undefined}
                    helperText={formError?.title?._errors[0]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Title />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="body"
                    label="Body"
                    name="body"
                    autoComplete="body"
                    multiline
                    rows={4}
                    value={formData.body}
                    onChange={handleFormChange}
                    error={formError?.body !== undefined}
                    helperText={formError?.body?._errors[0]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="tags"
                    label="Tags"
                    name="tags"
                    autoComplete="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    error={formError?.tags !== undefined}
                    helperText={formError?.tags?._errors[0]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tag />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <CardActions>
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      loading={loadingFormSubmitButton}
                      sx={{ mt: 3 }}
                    >
                      <span>Submit</span>
                    </LoadingButton>
                  </CardActions>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card sx={{ minWidth: 275 }}>
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
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ minWidth: 275 }}>
                  <CardHeader
                    title="Subscription List"
                    action={
                      <IconButton
                        aria-label="refresh"
                        onClick={() => getSubscriptionList()}
                      >
                        <Refresh />
                      </IconButton>
                    }
                  />
                  <CardContent>
                    {loadingSubscriptionList ? (
                      <CircularProgress />
                    ) : (
                      <TableContainer>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>Action</TableCell>
                              <TableCell>ID</TableCell>
                              <TableCell>Token</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {subscriptions.map((subscription) => (
                              <TableRow key={subscription.id}>
                                <TableCell>
                                  <ContentCopy
                                    onClick={handleCopySubscriptionId(
                                      subscription,
                                    )}
                                    style={{ cursor: "pointer" }}
                                  />
                                </TableCell>
                                <TableCell>{subscription.id}</TableCell>
                                <TableCell>{subscription.token}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
