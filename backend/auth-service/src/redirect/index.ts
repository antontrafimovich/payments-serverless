import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { createAuthService } from "../shared";

const authService = createAuthService({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUris: [process.env.GOOGLE_REDIRECT_URI!],
});

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { code, scope } = event.queryStringParameters!;
  const resultCode = `${code}&scope=${scope?.split(" ").join("+")}`;

  console.log("Result code:", resultCode)

  try {
    const { tokens } = await authService.getToken(resultCode);

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
