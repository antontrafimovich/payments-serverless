import { useEffect, useMemo, useState } from "react";

export const useGet = (url: string, settings?: RequestInit) => {
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  );

  const [data, setData] = useState<any>();

  const [pending, setPending] = useState<boolean>(true);

  useEffect(() => {
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
  }, [url, settings]);

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
    return fetch(url, {
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

        return data;
      });
  };

  return useMemo(
    () => ({
      post: send,
      pending,
      data,
      error,
    }),
    [send, pending, data, error]
  );
};

type RequestFn = (...args: any) => Promise<Response>;

export const usePostNew = (request: RequestFn) => {
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  );

  const [data, setData] = useState<any>();

  const [pending, setPending] = useState<boolean>(false);

  const send = (...args: Parameters<RequestFn>) => {
    setPending(true);
    return request(...args)
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

        return data;
      });
  };

  return useMemo(
    () => ({
      post: send,
      pending,
      data,
      error,
    }),
    [send, pending, data, error]
  );
};
