import { useState } from "react";

export default function useStateIsLoading(initialState: boolean = false) {
  return useState<boolean>(initialState);
}
