import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const Redirect = () => {
  const { search } = useLocation();

  const query = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const token = useMemo(() => {
    return query.toString().split("code=")[1];
  }, [query]);

  localStorage.setItem("token", token);

  window.close();

  return <div>Redirect {query}</div>;
};
