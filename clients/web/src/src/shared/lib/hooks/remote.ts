import { useEffect, useMemo, useState } from "react";

type RequestFn = (...args: any) => Promise<Response>;

export const useGet = (request: RequestFn) => {
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  );

  const [data, setData] = useState<any>();

  const [pending, setPending] = useState<boolean>(true);

  useEffect(() => {
    request()
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
  }, []);

  return {
    pending,
    data,
    error,
  };
};

export const usePost = (request: RequestFn) => {
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
