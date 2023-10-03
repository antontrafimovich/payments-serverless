import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

import { ThirdPartyAuthService } from "../shared";

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
}
