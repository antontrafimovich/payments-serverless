import {
  createGoogleService,
  ExternalStorageService,
} from "../../../../src/shared";

const mockLambdaClientSend = jest.fn();

jest.mock("@aws-sdk/client-lambda", () => {
  return {
    InvokeCommand: jest
      .fn()
      .mockImplementation(
        ({
          FunctionName,
          InvocationType,
          Payload,
        }: {
          FunctionName: string;
          InvocationType: string;
          Payload: string;
        }) => {
          return {};
        }
      ),
    LambdaClient: jest
      .fn()
      .mockImplementation(({ region }: { region: string }) => {
        return {
          send: mockLambdaClientSend,
        };
      }),
  };
});

describe("Report Service's GoogleService", () => {
  describe("getFileContentById", () => {
    let googleServiceClient: ExternalStorageService;

    beforeEach(() => {
      googleServiceClient = createGoogleService();
    });

    it("should be defined", () => {
      expect(googleServiceClient.getFileContentById).toBeDefined();
    });

    it("should throw error if remote lamda returns error response", async () => {
      const FIELD_ID = "TEST_FIELD_ID";
      const TOKEN = "FAKE_TOKEN";
      const LAMBDA_CLIENT_SEND_ERROR = new Error("LAMBDA_CLIENT_SEND_ERROR");
      mockLambdaClientSend.mockImplementation(() => {
        throw LAMBDA_CLIENT_SEND_ERROR;
      });

      await expect(
        googleServiceClient.getFileContentById(FIELD_ID, TOKEN)
      ).rejects.toBe(LAMBDA_CLIENT_SEND_ERROR);
    });
  });

  it("should t", () => {
    expect(createGoogleService().getFileContentById).toBeDefined();
  });
});
