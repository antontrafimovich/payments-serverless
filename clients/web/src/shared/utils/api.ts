import { useState } from "react";

export const useFetch = (url: string, settings?: RequestInit) => {
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  );

  const [data, setData] = useState<any>();

  const [pending, setPending] = useState<boolean>(true);

  fetch(url, settings)
    .then((response) => {
      setPending(false);

      if (!response.ok) {
        setError({
          code: response.status,
          message: response.statusText,
        });
      }

      if (response.headers.get("Content-Type") === "application/json") {
        return response.json();
      }

      return response.text();
    })
    .then((data) => {
      setData(data);
    });

  return {
    pending,
    data,
    error,
  };
};
