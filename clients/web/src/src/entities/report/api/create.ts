import { apiPaths } from "../../../shared";

export const create = (input: File, bank: string): Promise<Response> => {
  const formData = new FormData();
  formData.append("report", input);
  formData.append("bank", bank);

  return fetch(apiPaths.report + "/report", {
    method: "POST",
    body: formData,
  });
};
