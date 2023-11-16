import { APIGatewayEvent } from "aws-lambda";
import { EOL } from "node:os";

import { handler } from "../../../src/get-report-content";
import { stringToError, toResponse } from "../../../src/shared";

const mockGetFileContentById = jest.fn();
jest.mock("../../../src/shared/service/google.service", () => {
  return {
    createGoogleService: () => ({
      getFileContentById: mockGetFileContentById,
    }),
  };
});

jest.mock("../../../src/get-report-content/with-auth", () => {
  return {
    withAuth: (handler: unknown) => handler,
  };
});

jest.mock("../../../src/get-report-content/with-required-param", () => {
  return {
    withRequiredParam: (handler: unknown) => handler,
  };
});

describe("getReportContentHandler", () => {
  it("should return 500 error response if get file content by id from remote service ended with error", async () => {
    const TEST_REPORT_ID = "TEST_REPORT_ID";
    const error = new Error("Some data has been errored");
    mockGetFileContentById.mockImplementation(() => {
      throw error;
    });

    const MOCK_EVENT = {
      pathParameters: {
        reportId: TEST_REPORT_ID,
      },
      headers: {
        Authorization: "Bearer asdfsadf",
      },
    } as any as APIGatewayEvent;

    await expect(handler(MOCK_EVENT)).resolves.toEqual(
      stringToError(error.message, 500)
    );
  });

  it("should return report data if exists", async () => {
    const TEST_REPORT_ID = "TEST_REPORT_ID";
    const FILE_CONTENT_STRING = `ID,Name,Value${EOL}1,2,3${EOL}4,5,6`;
    mockGetFileContentById.mockImplementation(() => {
      return FILE_CONTENT_STRING;
    });
    const PARSED_RESULT = toResponse({
      statusCode: 200,
      body: JSON.stringify({
        headers: ["ID", "Name", "Value"],
        data: [
          ["1", "2", "3"],
          ["4", "5", "6"],
        ],
      }),
    });
    const MOCK_EVENT = {
      pathParameters: {
        reportId: TEST_REPORT_ID,
      },
      headers: {
        Authorization: "Bearer asdfsadf",
      },
    } as any as APIGatewayEvent;

    await expect(handler(MOCK_EVENT)).resolves.toEqual(PARSED_RESULT);
  });
});
