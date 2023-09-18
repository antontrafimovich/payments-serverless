import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { array, InferType, mixed, object, string } from "yup";

import { createNotionStorage } from "./storage";
import { getTypes } from "./types";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let types;

  try {
    types = await getTypes();
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      body: "Something wrong with types",
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  }

  const bodySchema = array(
    object({
      address: string().required(),
      type: mixed<string>().oneOf(types).required(),
    })
  ).required();

  const validate = (v: unknown) => {
    return bodySchema.validate(v);
  };

  const storage = createNotionStorage({
    key: process.env.NOTION_KEY as string,
  });

  if (event.body === null) {
    return {
      statusCode: 400,
      body: "Body must contain item to add",
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  }

  let bodyParams;

  try {
    bodyParams = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 500,
      body: typeof err === "string" ? err : (err as Error).message,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  }

  let mappings: InferType<typeof bodySchema>;

  try {
    mappings = await validate(bodyParams);
  } catch (err) {
    return {
      statusCode: 400,
      body: `Body schema validation error: ${
        typeof err === "string" ? err : (err as Error).message
      }`,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  }

  try {
    const promises = mappings?.map(storage.post);

    await Promise.all(promises);
  } catch (err) {
    return {
      statusCode: 500,
      body: typeof err === "string" ? err : (err as Error).message,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(mappings),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
};
