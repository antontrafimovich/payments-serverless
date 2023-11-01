import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useLocalStorage } from "../../shared/lib/hooks/local-storage";

export const Main = () => {
  const [token] = useLocalStorage("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token]);

  return <Navigate to={"/reports"} />;
};
