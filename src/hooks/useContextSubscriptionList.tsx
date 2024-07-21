import useFetchGetSubscriptionList from "@/hooks/useFetchGetSubscriptionList";
import { createContext, ReactNode, useContext } from "react";

type SubscriptionListContextType = ReturnType<
  typeof useFetchGetSubscriptionList
>;

export const SubscriptionListContext =
  createContext<SubscriptionListContextType>({
    isLoading: false,
    subscriptions: [],
    error: undefined,
    getSubscriptionList: async () => {},
  });

export default function useContextSubscriptionList() {
  return useContext<SubscriptionListContextType>(SubscriptionListContext);
}

export function SubscriptionListContextProvider({
  children,
}: Readonly<{
  children?: ReactNode;
}>) {
  return (
    <SubscriptionListContext.Provider value={useFetchGetSubscriptionList()}>
      {children}
    </SubscriptionListContext.Provider>
  );
}
