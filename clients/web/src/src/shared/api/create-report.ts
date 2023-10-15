import { apiPaths } from "../config";

export const createReport = (file: File, bank: string) => {
  const formData = new FormData();
  formData.append("report", file);
  formData.append("bank", bank);

  return fetch(apiPaths.report + "/report", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
