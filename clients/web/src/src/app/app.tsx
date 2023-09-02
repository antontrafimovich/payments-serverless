import { useContext } from "react";

import { Loader } from "../pages/loader";
import { Payments } from "../pages/payments";
import { withProviders } from "./providers";
import { AppContext } from "./providers/app";

function App() {
  const { report } = useContext(AppContext);

  if (report && report.data && !report.pending) {
    return <Payments info={report.data} />;
  }

  return <Loader />;
}

export default withProviders(App);
