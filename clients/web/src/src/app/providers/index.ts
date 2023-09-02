import compose from "compose-function";

import { withAppProvider } from "./app";
import { withMantineProvider } from "./mantine";

export const withProviders = compose(withMantineProvider, withAppProvider);
