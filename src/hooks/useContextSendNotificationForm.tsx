import useStateSendNotificationForm, {
  StateSendNotificationForm,
} from "@/hooks/useStateSendNotificationForm";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

type SendNotificationFormContextType = StateSendNotificationForm;

export const SendNotificationFormContext =
  createContext<SendNotificationFormContextType>([
    {
      subscription_id: "",
      title: "",
      body: "",
      tags: "",
    },
    () => {},
    () => {},
  ]);

export default function useContextSendNotificationForm() {
  return useContext<SendNotificationFormContextType>(
    SendNotificationFormContext,
  );
}

export function SendNotificationFormContextProvider({
  children,
}: Readonly<{
  children?: ReactNode;
}>) {
  const [data, setData, updateData] = useStateSendNotificationForm();

  const cachedData = useMemo<typeof data>(() => data, [data]);
  const cachedSetData = useCallback<typeof setData>(
    (data) => {
      setData(data);
    },
    [setData],
  );
  const cachedUpdateData = useCallback<typeof updateData>(
    (value) => {
      updateData(value);
    },
    [updateData],
  );

  return (
    <SendNotificationFormContext.Provider
      value={[cachedData, cachedSetData, cachedUpdateData]}
    >
      {children}
    </SendNotificationFormContext.Provider>
  );
}
