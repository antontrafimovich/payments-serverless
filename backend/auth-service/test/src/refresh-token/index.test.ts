import { APIGatewayEvent } from "aws-lambda";

import { handler } from "../../../src/refresh-token";
import { createResponse } from "../../../src/refresh-token/shared/lib/response";
import {
  INCORRECT_BODY_FORMAT_ERROR,
  UNAUTHORIZED_ERROR,
} from "../../../src/refresh-token/shared/lib/errors";

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
});
