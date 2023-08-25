import { PropsWithChildren, createContext, useState } from "react";
import { apiPaths, usePost } from "./shared";

type AppContext = {
  report: {
    pending: boolean | null;
    data: { headers: string[]; data: string[][] } | null;
  } | null;
  createReport: ((v: FormData) => void) | null;
  loadReport: ((v: File | null) => void) | null;
};

export const AppContext = createContext<AppContext>({
  report: null,
  createReport: null,
  loadReport: null,
});

export const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  const [data, setData] = useState<any>(null);

  const { post, pending } = usePost(apiPaths.report + "/report");

  return (
    <AppContext.Provider
      value={{
        report: { pending, data },
        createReport: (formData: FormData) => {
          post(formData).then((data) => setData(data));
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
      {children}
    </AppContext.Provider>
  );
};
