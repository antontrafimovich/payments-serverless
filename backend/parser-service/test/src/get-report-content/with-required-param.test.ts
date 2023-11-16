import { APIGatewayEvent } from "aws-lambda";

import { withAuth } from "../../../src/get-report-content/with-auth";
import { withRequiredParam } from "../../../src/get-report-content/with-required-param";
import { stringToError } from "../../../src/shared";

const MOCK_HANDLER = jest.fn();

describe("withRequiredParam", () => {
  it("should return error if pathParameters are not provided", async () => {
    const MOCK_EVENT = {} as APIGatewayEvent;
    const TEST_PARAM_NAME = "TEST";

    await expect(
      withRequiredParam(MOCK_HANDLER, TEST_PARAM_NAME)(MOCK_EVENT)
    ).resolves.toEqual(
      stringToError(`${TEST_PARAM_NAME} is not provided`, 400)
    );
  });

  it("should return error if pathParameters doesn't have provided param", async () => {
    const MOCK_EVENT = {
      pathParameters: {},
    } as APIGatewayEvent;
    const TEST_PARAM_NAME = "TEST";

    await expect(
      withRequiredParam(MOCK_HANDLER, TEST_PARAM_NAME)(MOCK_EVENT)
    ).resolves.toEqual(
      stringToError(`${TEST_PARAM_NAME} is not provided`, 400)
    );
  });

  it("should return execute argument function if required pathParameter is provided", async () => {
    const TEST_PARAM_NAME = "TEST";
    const MOCK_EVENT = {
      pathParameters: {
        [TEST_PARAM_NAME]: "asdfasdf",
      },
    } as any as APIGatewayEvent;

    await withRequiredParam(MOCK_HANDLER, TEST_PARAM_NAME)(MOCK_EVENT);

    await expect(MOCK_HANDLER).toBeCalledTimes(1);
  });
});
