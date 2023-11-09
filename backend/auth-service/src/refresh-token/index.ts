import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import {
  AuthService,
  GoogleAuthService,
  ThirdPartyAuthService,
} from "../shared";

const getAuthService = (type: "google" | "local"): AuthService => {
  if (type === "google") {
    return new GoogleAuthService();
  }

  return {} as any;
};

const localAuthHandler = (authService: AuthService) => {
  return Promise.resolve({
    statusCode: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
    body: "",
  });
};

const thirdPartyAuthHandler = async (
  authService: ThirdPartyAuthService,
  payload: { token: string; redirectUri: string }
): Promise<APIGatewayProxyResult> => {
  try {
    const newCreds = await authService.refreshToken(
      payload.token,
      payload.redirectUri
    );

    console.log("New credentials url:", newCreds);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(newCreds),
    };
  } catch (err) {
    const error = new Error(`Error generating auth URL: ${err}`);
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Content-type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(error),
    };
  }
};

const isThirdPartyAuthService = (
  authService: AuthService
): authService is ThirdPartyAuthService => {
  return authService.isThirdParty;
};

const handleRefresh = (
  authService: AuthService,
  payload: any
): Promise<APIGatewayProxyResult> => {
  if (isThirdPartyAuthService(authService)) {
    return thirdPartyAuthHandler(authService, payload);
  }

  return localAuthHandler(authService);
};

type AuthType = "google" | "local";

const DEFAULT_AUTH_TYPE: AuthType = "google";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const body = JSON.parse(event.body!);

  const type = body?.type ?? DEFAULT_AUTH_TYPE;

  const [, token] = event.headers["Authorization"]?.split("Bearer ")!;

  if (!token) {
    return {
      statusCode: 401,
      headers: {
        "Content-type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: "User is not authenticated",
    };
  }

  const authService = getAuthService(type);

  return handleRefresh(authService, {
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    token,
  });
};
