import useStateError from "@/hooks/useStateError";
import useStateIsLoading from "@/hooks/useStateIsLoading";
import { useCallback, useState } from "react";

export default function useFetch<T>() {
  const [isLoading, setIsLoading] = useStateIsLoading();
  const [response, setResponse] = useState<Response>(new Response());
  const [jsonResponse, setJsonResponse] = useState<T>();
  const [error, setError] = useStateError();

  const runFetch = useCallback(
    async (...params: Parameters<typeof fetch>) => {
      try {
        setIsLoading(true);
        const response = await fetch(...params);

        if (!response.ok) {
          throw new Error("Failed to get subscription list.");
        }

        setResponse(response);
        setJsonResponse((await response.json()) as T);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [setError, setIsLoading],
  );

  return { isLoading, response, jsonResponse, error, runFetch };
}
