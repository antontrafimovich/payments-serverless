import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

import { ThirdPartyAuthService } from "../model";

export class GoogleAuthService extends ThirdPartyAuthService {
  async generateUrl(redirectUrl: string): Promise<string> {
    const client = new LambdaClient({ region: process.env.REGION });
    const command = new InvokeCommand({
      FunctionName: process.env.GOOGLE_AUTH_HANDLER_FUNCTION_NAME as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ body: { redirectUri: redirectUrl } }),
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
      console.log("Decoding Google Lambda Auth Response error:", err);
      throw err;
    }
  }

  async getToken(
    code: string,
    redirectUrl: string
  ): Promise<Record<string, any>> {
    const client = new LambdaClient({ region: process.env.REGION });
    const command = new InvokeCommand({
      FunctionName: process.env.GOOGLE_GET_TOKEN_FUNCTION_NAME as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ body: { redirectUri: redirectUrl, code } }),
    });

    let response;
    try {
      console.log("get token command has been invoked");
      response = await client.send(command);
    } catch (err) {
      console.error(
        "Auth Service: error with google's getToken functionality",
        err
      );
      throw err;
    }

    try {
      console.log("Response has been received:", response);
      const rawResponse = new TextDecoder("utf-8").decode(response.Payload);

      console.log("response string:", JSON.parse(rawResponse));

      return JSON.parse(rawResponse);
    } catch (err) {
      console.log("Decoding Google Lambda GetToken Response error:", err);
      throw err;
    }
  }

  async refreshToken(token: string): Promise<Record<string, any>> {
    const client = new LambdaClient({ region: process.env.REGION });
    const command = new InvokeCommand({
      FunctionName: process.env.GOOGLE_REFRESH_TOKEN_FUNCTION_NAME as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ body: { token } }),
    });

    let response;
    try {
      console.log("Refresh token command has been invoked");
      response = await client.send(command);
    } catch (err) {
      console.error(
        "Auth Service: error with google's refreshToken functionality",
        err
      );
      throw err;
    }

    try {
      const rawResponse = new TextDecoder("utf-8").decode(response.Payload);
      const parsedResonse = JSON.parse(rawResponse);

      console.log("parsedResponse:", parsedResonse);

      if (parsedResonse.errorType) {
        throw new Error(parsedResonse.errorMessage);
      }

      return JSON.parse(rawResponse);
    } catch (err) {
      console.log("Decoding Google Lambda RefreshToken Response error:", err);
      throw err;
    }
  }
}
