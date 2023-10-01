import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { createAuthService } from "../shared";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { requestContext } = event;
  const { domainName } = requestContext;

  const authService = createAuthService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUris: [`https://${domainName}/prod/auth/redirect`],
  });

  const { code } = event.queryStringParameters!;

  try {
    const { tokens } = await authService.getToken(code!);

    return {
      statusCode: 301,
      headers: {
        Location: `${process.env.FRONTEND_REDIRECT_URI}?code=${btoa(
          JSON.stringify(tokens)
        )}`,
      },
      body: "",
    };
  } catch (err) {
    console.error("Google code parsing error:", err);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/plain",
      },
      body: `Google code parsing error: ${err}`,
    };
  }
};
