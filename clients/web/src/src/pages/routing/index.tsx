import { Route, Routes } from "react-router-dom";

import { Main } from "../main";
import { Redirect } from "../redirect";
import { Auth } from "../auth/auth";
import { ReportSelector } from "../selector/report-selector";
import { Payments } from "../payments";

export const Routing = () => {
  return (
    <Routes>
      <Route path="redirect" element={<Redirect />} />
      <Route path="/" element={<Main />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reports" element={<ReportSelector />} />
      <Route path="/payments/:reportId" element={<Payments />} />
    </Routes>
  );
};
