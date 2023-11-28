import { Route, Routes } from "react-router-dom";

import { Main } from "../main";
import { Redirect } from "../redirect/redirect";
import { Auth } from "../auth/auth";
import { ReportsViewerFeature } from "../reports/reports-viewer-feature";
import { Payments } from "../payments";

export const Routing = () => {
  return (
    <Routes>
      <Route path="redirect" element={<Redirect />} />
      <Route path="/" element={<Main />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reports" element={<ReportsViewerFeature />} />
      <Route path="/reports/:reportId" element={<ReportsViewerFeature />} />
      {/* <Route path="/payments/:reportId" element={<Payments />} /> */}
    </Routes>
  );
};
