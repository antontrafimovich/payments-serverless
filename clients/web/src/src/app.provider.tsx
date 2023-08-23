import { PropsWithChildren, createContext } from "react";
import { apiPaths, usePost } from "./shared";

type AppContext = {
  report: {
    pending: boolean | null;
    data: { headers: string[]; data: string[][] } | null;
  } | null;
  createReport: ((v: FormData) => void) | null;
};

export const AppContext = createContext<AppContext>({
  report: null,
  createReport: null,
});

export const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  const { post, pending, data } = usePost(apiPaths.report + "/report");

  return (
    <AppContext.Provider
      value={{
        report: { pending, data },
        createReport: (formData: FormData) => {
          post(formData);
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
