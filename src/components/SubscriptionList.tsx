"use client";

import { enqueueSnackbar } from "@/components/Popup";
import useContextSendNotificationForm from "@/hooks/useContextSendNotificationForm";
import useContext from "@/hooks/useContextSubscriptionList";
import useStateSet from "@/hooks/useStateSet";
import { prisma } from "@/models";
import { ContentCopy, DeleteOutline, Refresh } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { MouseEventHandler, useEffect } from "react";

export default function SubscriptionList() {
  const { isLoading, subscriptions, error, getSubscriptionList } = useContext();
  const [, , updateData] = useContextSendNotificationForm();

  useEffect(() => {
    getSubscriptionList();
  }, [getSubscriptionList]);

  useEffect(() => {
    if (error) {
      // @ts-ignore:next-line
      enqueueSnackbar(error?.message, { variant: "error" });
      console.error(error);
    }
  }, [error]);

  const [subscriptionCopies, , addSubscriptionCopy, removeSubscriptionCopy] =
    useStateSet<prisma.Subscription["id"]>();
  const handleCopySubscription =
    (subscription: prisma.Subscription): MouseEventHandler<HTMLButtonElement> =>
    () => {
      addSubscriptionCopy(subscription.id);
      navigator.clipboard.writeText(subscription.id);
      updateData({
        subscription_id: subscription.id,
      });
      removeSubscriptionCopy(subscription.id);
      enqueueSnackbar("Sucessfully copied Subscription ID", {
        variant: "success",
      });
    };

  const [
    subscriptionDeletes,
    ,
    addSubscriptionDelete,
    removeSubscriptionDelete,
  ] = useStateSet<prisma.Subscription["id"]>();
  const handleDeleteSubscription =
    (subscription: prisma.Subscription): MouseEventHandler<HTMLButtonElement> =>
    async () => {
      if (
        !confirm(
          `Are you sure to delete this subscription data? [${subscription.id}]`,
        )
      ) {
        return;
      }

      try {
        addSubscriptionDelete(subscription.id);

        const response = await fetch(`/api/subscriptions/${subscription.id}`, {
          method: "DELETE",
        });

        if (response.status !== 200) {
          throw new Error(
            ((await response.json()) as { message: string })?.message ||
              "Failed to delete subscription.",
          );
        }

        enqueueSnackbar("Subscription deleted successfully.", {
          variant: "success",
        });
      } catch (error) {
        // @ts-ignore:next-line
        enqueueSnackbar(error?.message, { variant: "error" });
        console.error(error);
      } finally {
        await getSubscriptionList();
        removeSubscriptionDelete(subscription.id);
      }
    };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader
        title="Subscription List"
        action={
          <IconButton aria-label="refresh" onClick={getSubscriptionList}>
            <Refresh />
          </IconButton>
        }
      />
      <CardContent>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <TableContainer>
            <Table stickyHeader>
              {subscriptions.length < 1 && <caption>Empty data</caption>}
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
                      <ButtonGroup
                        color="inherit"
                        variant="text"
                        aria-label="Basic button group"
                      >
                        <LoadingButton
                          color="success"
                          loading={subscriptionCopies?.has(subscription.id)}
                          onClick={handleCopySubscription(subscription)}
                        >
                          <ContentCopy />
                        </LoadingButton>
                        <LoadingButton
                          color="error"
                          loading={subscriptionDeletes?.has(subscription.id)}
                          onClick={handleDeleteSubscription(subscription)}
                        >
                          <DeleteOutline />
                        </LoadingButton>
                      </ButtonGroup>
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
  );
}
