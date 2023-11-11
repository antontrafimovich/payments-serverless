export const createResponse = (
  code: number,
  body: string,
  contentType = "text/plain"
) => {
  return {
    statusCode: code,
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
    body,
  };
};
