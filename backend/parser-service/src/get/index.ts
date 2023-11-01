import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { stringToError, toResponse } from "../shared";
import { createGoogleService } from "../shared/service/google.service";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const [, token] = event.headers["Authorization"]?.split("Bearer ")!;

  if (!token) {
    return stringToError("User is not authenticated", 401);
  }

  const googleService = createGoogleService();

  const reports = await googleService.getFileListByName(
    ".moneytrack",
    token,
    process.env.GOOGLE_REDIRECT_URI!
  );

  console.log(reports);

  return toResponse({
    statusCode: 200,
    body: JSON.stringify(reports),
  });
};
