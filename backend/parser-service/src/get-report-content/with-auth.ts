import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { stringToError } from "../shared";

export const withAuth = (
  handler: (event: APIGatewayEvent) => Promise<APIGatewayProxyResult>
) => {
  return async (event: APIGatewayEvent) => {
    const authHeaderValue = event.headers?.["Authorization"];

    if (!authHeaderValue) {
      return stringToError("User is not authenticated", 401);
    }

    const [, token] = authHeaderValue.split("Bearer ");

    if (!token) {
      return stringToError("User is not authenticated", 401);
    }

    return handler(event);
  };
};
