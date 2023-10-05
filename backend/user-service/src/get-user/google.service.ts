import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

export class GoogleUserReceiverService {
  async getUser(token: string) {
    const client = new LambdaClient({ region: process.env.REGION });
    const command = new InvokeCommand({
      FunctionName: process.env.GOOGLE_GET_USER_HANDLER_FUNCTION_NAME!,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        body: {
          redirectUri:
            "https://7nbmfhr8y9.execute-api.eu-central-1.amazonaws.com/prod/auth/redirect",
          token,
        },
      }),
    });

    let response;
    try {
      console.log("Command has been invoked");
      response = await client.send(command);
    } catch (err) {
      console.error("Google Lambda GetUserInfo error:", err);
      throw err;
    }

    try {
      console.log("GetUserInfo has been received:", response);
      const rawResponse = new TextDecoder("utf-8").decode(response.Payload);

      return JSON.parse(rawResponse);
    } catch (err) {
      console.log("Decoding Google Lambda GetUserInfo Response error:", err);
      throw err;
    }
  }
}
