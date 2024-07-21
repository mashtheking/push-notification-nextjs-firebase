"use client";

import { enqueueSnackbar } from "@/components/Popup";
import useContext from "@/hooks/useContextSendNotificationForm";
import {
  type FormError,
  safeParse,
} from "@/schemas/SendNotificationFormSchema";
import { Description, Key, Tag, Title } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  InputAdornment,
  TextField,
} from "@mui/material";
import { ChangeEventHandler, FormEventHandler, useState } from "react";

export default function SendNotificationForm() {
  const [formData, , updateData] = useContext();
  const [formError, setFormError] = useState<FormError | null>(null);
  const [loadingFormSubmitButton, setLoadingFormSubmitButton] =
    useState<boolean>(false);

  const onChangeHandler: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    updateData({
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    try {
      event.preventDefault();
      setLoadingFormSubmitButton(true);

      const { success, error, data: parsedFormData } = safeParse(formData);
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
        throw new Error(
          ((await response.json()) as { message: string })?.message ||
            "Failed to send notification.",
        );
      }

      enqueueSnackbar("Notification sent successfully.", {
        variant: "success",
      });
    } catch (error) {
      // @ts-ignore:next-line
      enqueueSnackbar(error?.message, { variant: "error" });
      console.error(error);
    } finally {
      setLoadingFormSubmitButton(false);
    }
  };

  return (
    <Card>
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
            onChange={onChangeHandler}
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
            onChange={onChangeHandler}
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
            onChange={onChangeHandler}
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
            onChange={onChangeHandler}
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
  );
}
