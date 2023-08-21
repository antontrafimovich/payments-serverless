import { useState } from "react";

import { apiPaths } from "../api";

export const useGet = (url: string, settings?: RequestInit) => {
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  );

  const [data, setData] = useState<any>();

  const [pending, setPending] = useState<boolean>(true);

  fetch(import.meta.env.VITE_API_URL + url, settings)
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

export const usePost = (url: string, settings?: RequestInit) => {
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  );

  const [data, setData] = useState<any>();

  const [pending, setPending] = useState<boolean>(false);

  const send = (body: any) => {
    setPending(true);
    fetch(apiPaths.report + url, {
      ...(settings || {}),
      method: "post",
      body,
    })
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
  };

  return {
    post: send,
    pending,
    data,
    error,
  };
};
