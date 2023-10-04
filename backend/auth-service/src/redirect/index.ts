import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { GoogleAuthService, ThirdPartyAuthService } from "../shared";

const getAuthService = (type: "google"): ThirdPartyAuthService => {
  if (type === "google") {
    return new GoogleAuthService();
  }

  return {} as any;
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { code } = event.queryStringParameters!;
  const context = event.requestContext;
  const redirectUri = `${context.domainName}/prod/auth/redirect`;

  const authService = getAuthService("google");

  try {
    const token = await authService.getToken(code!, redirectUri);

    return {
      statusCode: 302,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        Location: `${process.env.FRONTEND_REDIRECT_URI}?token=${token}`,
      },
      body: "",
    };
  } catch (err) {
    console.error("AuthService: error in parsing code to token:", err);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: `AuthService: error in parsing code to token: ${err}`,
    };
  }
};
