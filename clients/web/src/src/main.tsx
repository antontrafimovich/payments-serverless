import "./index.css";

import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";

import { AppProvider } from "./app.provider.tsx";
import App from "./app.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppProvider>
        <App />
      </AppProvider>
    </MantineProvider>
  </React.StrictMode>
);
