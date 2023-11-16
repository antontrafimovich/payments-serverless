import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { withAuth } from "../../../src/get-report-content/with-auth";
import { stringToError } from "../../../src/shared";

const MOCK_HANDLER = jest.fn();

describe("withAuth", () => {
  it("should return error if authorization header is not provided", async () => {
    const MOCK_EVENT = {
      headers: {},
    } as APIGatewayEvent;

    await expect(withAuth(MOCK_HANDLER)(MOCK_EVENT)).resolves.toEqual(
      stringToError("User is not authenticated", 401)
    );
  });

  it("should return error if authorization header doesn't have Bearer type", async () => {
    const MOCK_EVENT = {
      headers: {
        Authorization: "asdfsadf",
      },
    } as any as APIGatewayEvent;

    await expect(withAuth(MOCK_HANDLER)(MOCK_EVENT)).resolves.toEqual(
      stringToError("User is not authenticated", 401)
    );
  });

  it("should return execute argument function if authorization is correct", async () => {
    const MOCK_EVENT = {
      headers: {
        Authorization: "Bearer asdfsadf",
      },
    } as any as APIGatewayEvent;

    await withAuth(MOCK_HANDLER)(MOCK_EVENT);

    await expect(MOCK_HANDLER).toBeCalledTimes(1);
  });
});
