import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";

import "@mantine/core/styles.css";

export const withMantineProvider = (Component: () => ReactNode) => {
  return () => {
    return (
      <MantineProvider>
        <Component />
      </MantineProvider>
    );
  };
};
