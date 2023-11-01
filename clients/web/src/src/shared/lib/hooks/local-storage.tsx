import { useCallback, useEffect, useState } from "react";

export const useLocalStorage = (key: string) => {
  const [value, setValue] = useState<unknown>(localStorage.getItem(key));

  useEffect(() => {
    window.addEventListener(
      "storage",
      function (event) {
        if (event.storageArea === localStorage) {
          setValue((prev: unknown) => {
            const maybeNewValue = localStorage.getItem(key);

            return maybeNewValue === prev ? prev : maybeNewValue;
          });
        }
      },
      false
    );
  }, [setValue]);

  const set = useCallback(
    (v: unknown) => {
      localStorage.setItem(key, String(v));
    },
    [key]
  );

  return [value, set];
};
