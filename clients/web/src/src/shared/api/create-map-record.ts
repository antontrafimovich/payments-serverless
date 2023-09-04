import { apiPaths } from "..";
import { CreateMapRecordDTO } from "../model";

export const createMapRecord = (data: CreateMapRecordDTO) => {
  return fetch(apiPaths.map + "/map/record", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
