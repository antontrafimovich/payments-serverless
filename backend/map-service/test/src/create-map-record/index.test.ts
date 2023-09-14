import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../../src/create-map-record";

jest.mock("../../../src/create-map-record/types.ts", () => {
  return {
    getTypes: jest.fn(() => ["Groceries", "Home"]),
  };
});

describe("createMapRecord", () => {
  expect.hasAssertions();
  
  it("should pass validators with correct params", async () => {
    const VALID_PARAMS = {
      body: JSON.stringify([
        {
          address: "KSK Krystian Sienko",
          type: "Groceries",
        },
      ]),
    } as APIGatewayProxyEvent;

    await handler(VALID_PARAMS);
  });
});
