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

  const authService = createAuthService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUris: [`https://${domainName}/prod/auth/redirect`],
  });

  const authHeaderValue = event.headers["authorization"];

  if (!authHeaderValue) {
    console.error("You're not logged in");

    return {
      statusCode: 401,
      headers: {
        "Content-type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: "You're not logged in",
    };
  }

  const [, token] = authHeaderValue.split("Bearer ");

  const decodedToken = decodeURIComponent(token);

  if (!token) {
    console.error("Some trouble with token");
    return {
      statusCode: 400,
      headers: {
        "Content-type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: "Some trouble with token",
    };
  }

  try {
    oAuth2Client.setCredentials(JSON.parse(atob(decodedToken)));
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: `Google OAuth2.0 error: ${JSON.stringify(err)}`,
    };
  }

  const oath2 = google.oauth2({ version: "v2", auth: oAuth2Client });

  try {
    const userInfo = await oath2.userinfo.get();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(userInfo),
    };
  } catch (err) {
    console.log("User info getting error:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: `User info getting error: ${JSON.stringify(err)}`,
    };
  }
};
