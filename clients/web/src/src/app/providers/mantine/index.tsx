import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";

export const withMantineProvider = (Component: () => ReactNode) => {
  return () => {
    return (
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Component />
      </MantineProvider>
    );
  };
};
