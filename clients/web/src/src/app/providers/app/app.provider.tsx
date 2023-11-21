import { createContext, ReactNode, useState } from "react";

import {
  createReport as createReportRequest,
  Report,
  usePost,
} from "../../../shared";
import { useLocalStorage } from "../../../shared/lib/hooks/local-storage";
import { parseJwt } from "../../../shared/lib/utils/jwt";

type UserInfo = {
  at_hash: string;
  aud: string;
  azp: string;
  exp: number;
  given_name: string;
  iat: number;
  iss: string;
  locale: string;
  name: string;
  picture: string;
  sub: string;
};

type AppContext = {
  report: {
    pending: boolean | null;
    data: Report | null;
  } | null;
  createReport: ((report: File, bank: string) => void) | null;
  userInfo: UserInfo | null;
};

export const AppContext = createContext<AppContext>({} as AppContext);

const getCredentials = (token: string) => {
  if (!token) {
    return null;
  }

  return JSON.parse(token);
};

const getUserInfoFromCreds = (creds: any) => {
  if (!creds) {
    return null;
  }

  return parseJwt<UserInfo>(creds?.id_token);
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
          userInfo: getUserInfoFromCreds(creds),
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
