import useFetch from "@/hooks/useFetch";
import { prisma } from "@/models";
import { useCallback, useEffect, useState } from "react";

export default function useFetchGetSubscriptionList() {
  const { isLoading, jsonResponse, error, runFetch } = useFetch<{
    data: Array<prisma.Subscription>;
  }>();
  const [subscriptions, setSubscriptions] = useState<
    Array<prisma.Subscription>
  >([]);

  const getSubscriptionList = useCallback(async () => {
    await runFetch("/api/subscriptions");
  }, [runFetch]);

  useEffect(() => {
    if (jsonResponse) {
      setSubscriptions(jsonResponse?.data);
    }
  }, [jsonResponse, getSubscriptionList]);

  return { isLoading, subscriptions, error, getSubscriptionList };
}
