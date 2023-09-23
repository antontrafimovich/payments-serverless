import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { createAuthService } from "../shared";
import {
  GOOGLE_DRIVE_FILE_SCOPE,
  GOOGLE_SPREADSHEET_SCOPE,
  GOOGLE_USERINFO_SCOPE,
} from "./constant";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { requestContext } = event;
  const { domainName } = requestContext;

  const authService = createAuthService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUris: [`https://${domainName}/prod/auth/redirect`!],
  });

  let authUrl;

  try {
    authUrl = authService.generateAuthUrl([
      GOOGLE_DRIVE_FILE_SCOPE,
      GOOGLE_SPREADSHEET_SCOPE,
      GOOGLE_USERINFO_SCOPE,
    ]);

    console.log("Auth url:", authUrl);

    return {
      statusCode: 301,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        Location: authUrl,
      },
      body: "",
    };
  } catch (err) {
    console.error("Error generating auth URL:", err);

    return {
      statusCode: 500,
      headers: {
        "Content-type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: `Error generating auth URL: ${err}`,
    };
  }
};
