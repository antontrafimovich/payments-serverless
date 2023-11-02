import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { EOL } from "node:os";

import { stringToError, toResponse } from "../shared";
import { createGoogleService } from "../shared/service/google.service";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { reportId } = event.pathParameters!;

  const [, token] = event.headers["Authorization"]?.split("Bearer ")!;

  if (!token) {
    return stringToError("User is not authenticated", 401);
  }

  const googleService = createGoogleService();

  const reports = await googleService.getFileContentById(
    reportId!,
    token,
    process.env.GOOGLE_REDIRECT_URI!
  );

  console.log(reports);

  const [headersString, ...contentStrings] = reports.split(EOL);

  return toResponse({
    statusCode: 200,
    body: JSON.stringify({
      headers: headersString.split(","),
      data: contentStrings.map((str) => str.split(",")),
    }),
  });
};
