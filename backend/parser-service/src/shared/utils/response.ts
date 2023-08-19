import { APIGatewayProxyResult } from "aws-lambda";

export const stringToError = (v: string, code: number = 500) => {
  return toResponse({
    statusCode: code,
    body: v,
    headers: {
      "Content-Type": "text/string",
    },
  });
};

export const toResponse = (
  response: APIGatewayProxyResult
): APIGatewayProxyResult => {
  return {
    ...response,
    headers: {
      ...(response.headers || {}),
      "Access-Control-Allow-Origin": "*",
    },
  };
};
