import { Route, Routes } from "react-router-dom";

import { Main } from "../main";
import { Redirect } from "../redirect";

export const Routing = () => {
  return (
    <Routes>
      <Route path="redirect" element={<Redirect />}  />
      <Route path="/" element={<Main />} />
    </Routes>
  );
};
