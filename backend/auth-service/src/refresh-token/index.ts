import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import {
  AuthService,
  GoogleAuthService,
  ThirdPartyAuthService,
} from "../shared";
import { createResponse } from "./shared/lib/response";
import {
  INCORRECT_BODY_FORMAT_ERROR,
  UNAUTHORIZED_ERROR,
} from "./shared/lib/errors";

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

const getAuthTypeFromBody = (body: string | null) => {
  if (!body) {
    return DEFAULT_AUTH_TYPE;
  }

  let bodyParsed;

  try {
    bodyParsed = JSON.parse(body);
  } catch (err) {
    throw INCORRECT_BODY_FORMAT_ERROR;
  }

  const { type } = bodyParsed;

  return type ?? DEFAULT_AUTH_TYPE;
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  let type: AuthType;

  try {
    type = getAuthTypeFromBody(event.body);
  } catch (err) {
    return createResponse(400, JSON.stringify(err), "application/json");
  }

  const authorizationHeader = event.headers?.["Authorization"];

  if (!authorizationHeader) {
    return createResponse(
      401,
      JSON.stringify(UNAUTHORIZED_ERROR),
      "application/json"
    );
  }

  const [, token] = authorizationHeader.split("Bearer ")!;

  if (!token) {
    return createResponse(
      401,
      JSON.stringify(UNAUTHORIZED_ERROR),
      "application/json"
    );
  }

  const authService = getAuthService(type);

  return handleRefresh(authService, {
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    token,
  });
};
