import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { AuthService, ThirdPartyAuthService } from "../shared";
import { GoogleAuthService } from "./google";

const getAuthService = (type: "google" | "local"): AuthService => {
  if (type === "google") {
    return new GoogleAuthService();
  }

  return {} as any;
};

const localAuthHandler = (authService: AuthService) => {
  return Promise.resolve({
    statusCode: 301,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
    body: "",
  });
};

const thirdPartyAuthHandler = async (
  authService: ThirdPartyAuthService
): Promise<APIGatewayProxyResult> => {
  try {
    const authUrl = await authService.generateUrl(process.env.REDIRECT_TO!);

    console.log("Auth url:", authUrl);

    return {
      statusCode: 302,
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

const isThirdPartyAuthService = (
  authService: AuthService
): authService is ThirdPartyAuthService => {
  return authService.isThirdParty;
};

const handleAuth = (
  authService: AuthService
): Promise<APIGatewayProxyResult> => {
  if (isThirdPartyAuthService(authService)) {
    return thirdPartyAuthHandler(authService);
  }

  return localAuthHandler(authService);
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const authService = getAuthService("google");

  return handleAuth(authService);
};
