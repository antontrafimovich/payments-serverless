import compose from "compose-function";

import { withAppProvider } from "./app/app.provider";
import { withMantineProvider } from "./mantine";
import { withQueryClientProvider } from "./query-client/query-client.provider";
import { withRoutingProvider } from "./routing";

export const withProviders = compose(
  withQueryClientProvider,
  withMantineProvider,
  withAppProvider,
  withRoutingProvider
);
