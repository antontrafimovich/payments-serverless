import { apiPaths } from "..";

export const getMapTypes = () => {
  return fetch(apiPaths.map + "/map/types");
};
