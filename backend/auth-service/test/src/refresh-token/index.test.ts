import { APIGatewayEvent } from "aws-lambda";

import { handler } from "../../../src/refresh-token";
import { createResponse } from "../../../src/refresh-token/shared/lib/response";
import {
  INCORRECT_BODY_FORMAT_ERROR,
  UNAUTHORIZED_ERROR,
} from "../../../src/refresh-token/shared/lib/errors";
import { getAuthService } from "../../../src/refresh-token/service/auth-service.factory";

const NEW_CREDS_MOCK = {
  access_token: "new_access_token",
  refresh_token: "new_refresh_token",
};
const mockRefreshToken = jest.fn();
jest.mock("../../../src/refresh-token/service/auth-service.factory", () => {
  return {
    getAuthService: () => ({
      refreshToken: mockRefreshToken,
    }),
  };
});

describe("RefreshToken handler", () => {
  it("should return 400 error if provided body is not in JSON format", async () => {
    const EVENT = {
      body: "asdaqwe",
    } as APIGatewayEvent;
    const RESPONSE = createResponse(
      400,
      JSON.stringify(INCORRECT_BODY_FORMAT_ERROR),
      "application/json"
    );

    await expect(handler(EVENT)).resolves.toEqual(RESPONSE);
  });

  it("should return 401 unauthorized error if token is not provided via authorization header", async () => {
    const EVENT = { headers: {} } as APIGatewayEvent;
    const RESPONSE = createResponse(
      401,
      JSON.stringify(UNAUTHORIZED_ERROR),
      "application/json"
    );

    await expect(handler(EVENT)).resolves.toEqual(RESPONSE);
  });

  it("should return 401 unauthorized error if token is not provided with Bearer schema", async () => {
    const EVENT = {
      headers: { Authorization: "asdasdasd" },
    } as any as APIGatewayEvent;
    const RESPONSE = createResponse(
      401,
      JSON.stringify(UNAUTHORIZED_ERROR),
      "application/json"
    );

    await expect(handler(EVENT)).resolves.toEqual(RESPONSE);
  });

  it("should return refreshed credentials for specified type", async () => {
    const EVENT = {
      body: "{}",
      headers: { Authorization: "Bearer asdasdasd" },
    } as any as APIGatewayEvent;
    mockRefreshToken.mockImplementation(() => {
      return NEW_CREDS_MOCK;
    });

    const RESPONSE = createResponse(200, JSON.stringify(NEW_CREDS_MOCK));

    await expect(handler(EVENT)).resolves.toEqual(RESPONSE);
  });

  it("should return 500 error if refresh credentials return error", async () => {
    const EVENT = {
      body: "{}",
      headers: { Authorization: "Bearer asdasdasd" },
    } as any as APIGatewayEvent;
    const ERROR_RESPONSE = {
      errorType: "Error",
      errorMessage: "No refresh token is set.",
    };
    mockRefreshToken.mockImplementation(() => {
      throw new Error(ERROR_RESPONSE.errorMessage);
    });

    const RESPONSE = createResponse(
      500,
      JSON.stringify(new Error(ERROR_RESPONSE.errorMessage))
    );

    await expect(handler(EVENT)).resolves.toEqual(RESPONSE);
  });
});
