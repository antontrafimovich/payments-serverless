import { createContext, ReactNode, useState } from "react";

import { usePostNew } from "../../../shared";
import { createReport as createReportRequest } from "../../../shared";

type AppContext = {
  report: {
    pending: boolean | null;
    data: { headers: string[]; data: string[][] } | null;
  } | null;
  createReport: ((report: File, bank: string) => void) | null;
  loadReport: ((v: File | null) => void) | null;
};

export const AppContext = createContext<AppContext>({
  report: null,
  createReport: null,
  loadReport: null,
});

export const withAppProvider = (Component: () => ReactNode) => {
  return () => {
    const [data, setData] = useState<any>(null);

    const { post, pending } = usePostNew(createReportRequest);

    return (
      <AppContext.Provider
        value={{
          report: { pending, data },
          createReport: (report: File, bank: string) => {
            post(report, bank).then((data) => setData(data));
          },
          loadReport: (file: File | null) => {
            if (!file) {
              return;
            }

            const reader = new FileReader();

            reader.addEventListener("load", (event) => {
              if (
                !event.target?.result ||
                typeof event.target.result !== "string"
              ) {
                return;
              }

              const resultString = event.target.result.split(",")[1];

              const data = atob(resultString);

              setData(JSON.parse(data));
            });

            reader.readAsDataURL(file);
          },
        }}
      >
        <Component />
      </AppContext.Provider>
    );
  };
};
