"use client";

import { enqueueSnackbar } from "@/components/Popup";
import useContextSendNotificationForm from "@/hooks/useContextSendNotificationForm";
import useContext from "@/hooks/useContextSubscriptionList";
import { prisma } from "@/models";
import { ContentCopy, Refresh } from "@mui/icons-material";
import {
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

  const handleCopySubscriptionId =
    (subscription: prisma.Subscription): MouseEventHandler<SVGSVGElement> =>
    () => {
      navigator.clipboard.writeText(subscription.id);
      updateData({
        subscription_id: subscription.id,
      });
      enqueueSnackbar("Sucessfully copied Subscription ID", {
        variant: "success",
      });
    };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader
        title="Subscription List"
        action={
          <IconButton
            aria-label="refresh"
            onClick={async () => {
              getSubscriptionList();
            }}
          >
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
                      <ContentCopy
                        onClick={handleCopySubscriptionId(subscription)}
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
  );
}
