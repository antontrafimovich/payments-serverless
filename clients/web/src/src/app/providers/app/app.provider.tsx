import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

import { Report, usePost } from "../../../shared";
import { createReport as createReportRequest } from "../../../shared";
import { useLocalStorage } from "../../../shared/lib/hooks/local-storage";

type AppContext = {
  report: {
    pending: boolean | null;
    data: Report | null;
  } | null;
  createReport: ((report: File, bank: string) => void) | null;
  authInfo: {
    expiryDate: number;
  };
};

export const AppContext = createContext<AppContext>({} as AppContext);

const getCredentials = (token: string) => {
  if (!token) {
    return null;
  }

  return JSON.parse(token);
};

export const withAppProvider = (Component: () => ReactNode) => {
  return () => {
    const [data, setData] = useState<Report | null>(null);
    const [token] = useLocalStorage("token");

    const creds = getCredentials(token as string);

    const { post, pending } = usePost(createReportRequest);

    return (
      <AppContext.Provider
        value={{
          authInfo: { expiryDate: creds?.expiry_date },
          report: { pending, data },
          createReport: (report: File, bank: string) => {
            post(report, bank)
              .then((data) => setData(data))
              .catch((err) => console.error(err));
          },
          // loadReport: (file: File | null) => {
          // if (!file) {
          //   return;
          // }

          // const reader = new FileReader();

          // reader.addEventListener("load", (event) => {
          //   if (
          //     !event.target?.result ||
          //     typeof event.target.result !== "string"
          //   ) {
          //     return;
          //   }

          //   const resultString = event.target.result.split(",")[1];

          //   const data = atob(resultString);

          //   setData(JSON.parse(data));
          // });

          // reader.readAsDataURL(file);
          // },
          // setReport: setData,
        }}
      >
        <Component />
      </AppContext.Provider>
    );
  };
};
