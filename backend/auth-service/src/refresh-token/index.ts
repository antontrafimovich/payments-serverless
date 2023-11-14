import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { getAuthService } from "./service/auth-service.factory";
import {
  createNewCredsGenerationError,
  UNAUTHORIZED_ERROR,
} from "./shared/lib/errors";
import { getAuthTypeFromEventBody } from "./shared/lib/helper/body-helper";
import { createResponse } from "./shared/lib/response";
import { AuthType } from "./shared/model/auth-type";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  let type: AuthType;

  try {
    type = getAuthTypeFromEventBody(event.body);
  } catch (err) {
    return createResponse(400, JSON.stringify(err), "application/json");
  }

  const authorizationHeader = event.headers?.["Authorization"];

  if (!authorizationHeader) {
    return createResponse(
      401,
      JSON.stringify(UNAUTHORIZED_ERROR),
      "application/json"
    );
  }

  const [, token] = authorizationHeader.split("Bearer ");

  if (!token) {
    return createResponse(
      401,
      JSON.stringify(UNAUTHORIZED_ERROR),
      "application/json"
    );
  }

  const authService = getAuthService(type);

  try {
    const newCreds = await authService.refreshToken(token);

    console.log("New credentials url:", newCreds);

    return createResponse(200, JSON.stringify(newCreds));
  } catch (err) {
    const error = createNewCredsGenerationError((err as Error).message);
    console.error(error);

    return createResponse(500, JSON.stringify(error));
  }
};
