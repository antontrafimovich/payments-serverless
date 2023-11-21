import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { EOL } from "node:os";

import { stringToError, toResponse } from "../shared";
import { withAuth } from "../shared/hocs/with-auth";
import { withRequiredParam } from "../shared/hocs/with-required-param";
import { createGoogleService } from "../shared/service/google.service";

const getReportContentHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const reportId = event.pathParameters!.reportId!;
  const [, token] = event.headers["Authorization"]!.split("Bearer ")!;

  const googleService = createGoogleService();

  try {
    const reports = await googleService.getFileContentById(reportId, token);

    console.log(reports);

    const [headersString, ...contentStrings] = reports.split(EOL);

    return toResponse({
      statusCode: 200,
      body: JSON.stringify({
        headers: headersString.split(","),
        data: contentStrings.map((str) => str.split(",")),
      }),
    });
  } catch (err) {
    return stringToError((err as Error).message, 500);
  }
};

export const handler = withRequiredParam(
  withAuth(getReportContentHandler),
  "reportId"
);
