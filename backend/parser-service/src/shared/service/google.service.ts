import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

export type ExternalFile = {
  name: string;
  id: string;
};

export type ExternalStorageService = {
  createStorage: (
    name: string,
    token: string,
    data: string[][],
    redirectUri: string
  ) => Promise<string>;
  getFileListByName: (
    name: string,
    token: string,
    redirectUri: string
  ) => Promise<ExternalFile[]>;
  getFileContentById: (fileId: string, token: string) => Promise<string>;
};

export const createGoogleService = (): ExternalStorageService => {
  const client = new LambdaClient({ region: process.env.REGION });

  return {
    createStorage: async (
      name: string,
      token: string,
      data: string[][],
      redirectUri: string
    ): Promise<string> => {
      const command = new InvokeCommand({
        FunctionName: process.env.GOOGLE_CREATE_SHEET_FUNCTION_NAME as string,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({
          body: { redirectUri, fileName: name, token, data },
        }),
      });

      let response;
      try {
        console.log("Command has been invoked");
        response = await client.send(command);
      } catch (err) {
        console.error("Google Lambda Invokation error:", err);
        throw err;
      }

      try {
        console.log("Response has been received:", response);
        const rawResponse = new TextDecoder("utf-8").decode(response.Payload);

        return JSON.parse(rawResponse);
      } catch (err) {
        console.log("Decoding Google Lambda Create Sheet Response error:", err);
        throw err;
      }
    },

    getFileListByName: async (
      name: string,
      token: string,
      redirectUri: string
    ): Promise<ExternalFile[]> => {
      const command = new InvokeCommand({
        FunctionName: process.env.GOOGLE_GET_FILE_LIST_FUNCTION_NAME as string,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({
          body: { redirectUri, fileName: name, token },
        }),
      });

      let response;
      try {
        console.log("Command has been invoked");
        response = await client.send(command);
      } catch (err) {
        console.error("Google Lambda Invokation error:", err);
        throw err;
      }

      try {
        console.log("Response has been received:", response);
        const rawResponse = new TextDecoder("utf-8").decode(response.Payload);

        return JSON.parse(rawResponse);
      } catch (err) {
        console.log("Decoding Google Lambda GetFileList response error:", err);
        throw err;
      }
    },
    getFileContentById: async (
      fileId: string,
      token: string
    ): Promise<string> => {
      const command = new InvokeCommand({
        FunctionName: process.env
          .GOOGLE_GET_FILE_CONTENT_FUNCTION_NAME as string,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({
          body: { fileId, token },
        }),
      });

      let response;
      try {
        console.log("Command has been invoked");
        response = await client.send(command);
      } catch (err) {
        console.error("Google Lambda Invokation error:", err);
        throw err;
      }

      try {
        console.log("Response has been received:", response);
        const rawResponse = new TextDecoder("utf-8").decode(response.Payload);

        return JSON.parse(rawResponse);
      } catch (err) {
        console.log(
          "Decoding Google Lambda GetFileContent response error:",
          err
        );
        throw err;
      }
    },
  };
};
