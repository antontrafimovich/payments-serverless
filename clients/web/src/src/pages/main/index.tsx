import { useContext } from "react";

import { AppContext } from "../../app";
import { Loader } from "../loader";
import { Payments } from "../payments";

export const Main = () => {
  const { report } = useContext(AppContext);

  if (report && report.data && !report.pending) {
    return <Payments report={report.data} />;
  }

  return <Loader />;
};
