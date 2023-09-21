import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

export const withRoutingProvider = (Component: () => ReactNode) => {
  return () => {
    return (
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );
  };
};
