import { useEffect, useState } from "react";

export const useLocalStorage = (map: (storage: Storage) => unknown) => {
  const [value, setValue] = useState<unknown>(null);

  useEffect(() => {
    window.addEventListener(
      "storage",
      function (event) {
        if (event.storageArea === localStorage) {
          setValue((prev: unknown) => {
            const maybeNewValue = map(localStorage);

            return maybeNewValue === prev ? prev : maybeNewValue;
          });
        }
      },
      false
    );
  }, [setValue]);

  return value;
};
