import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

export const getTypes = async () => {
  const client = new LambdaClient({ region: process.env.REGION });
  const command = new InvokeCommand({
    FunctionName: process.env.GET_TYPES_FUNCTION_NAME as string,
    InvocationType: "RequestResponse",
  });

  const response = await client.send(command);

  const responseString = new TextDecoder().decode(response.Payload);
  const responseJSON = JSON.parse(responseString);

  return JSON.parse(responseJSON.body);
};
