import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { toResponse } from "../shared";
import { withAuth } from "../shared/hocs/with-auth";
import { createGoogleService } from "../shared/service/google.service";

const getReports = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const [, token] = event.headers["Authorization"]!.split("Bearer ");
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

export const handler = withAuth(getReports);
