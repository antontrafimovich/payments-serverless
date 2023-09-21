import compose from "compose-function";

import { withAppProvider } from "./app";
import { withMantineProvider } from "./mantine";
import { withRoutingProvider } from "./routing";

export const withProviders = compose(
  withMantineProvider,
  withAppProvider,
  withRoutingProvider
);
