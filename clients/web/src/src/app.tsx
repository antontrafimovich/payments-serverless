import "./app.css";

import { useContext } from "react";

import { AppContext } from "./app.provider";
import { Expenses } from "./expenses/expenses";
import { Loader } from "./loader/loader";

function App() {
  const { report } = useContext(AppContext);

  if (report && report.data && !report.pending) {
    return <Expenses info={report.data} />;
  }

  return <Loader />;
}

export default App;
