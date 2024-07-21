import {
  FormData,
  PartialFormData,
} from "@/schemas/SendNotificationFormSchema";
import { Dispatch, SetStateAction, useState } from "react";

export type StateSendNotificationForm = [
  FormData,
  Dispatch<SetStateAction<FormData>>,
  Dispatch<PartialFormData>,
];

export default function useStateSendNotificationForm(): StateSendNotificationForm {
  const [data, setData] = useState<FormData>({
    subscription_id: "",
    title: "",
    body: "",
    tags: "",
  });

  const updateData: Dispatch<PartialFormData> = (value) => {
    setData({
      ...data,
      ...value,
    });
  };

  return [data, setData, updateData];
}
