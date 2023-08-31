import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { Client } from "@notionhq/client";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { array, InferType, mixed, object, string } from "yup";

const getTypes = () => {
  const client = new LambdaClient({ region: process.env.REGION });
  const command = new InvokeCommand({
    FunctionName: process.env.GET_TYPES_FUNCTION_NAME as string,
    InvocationType: "RequestResponse",
  });

  return client.send(command);
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let types;

  try {
    const response = await getTypes();
    const responseString = new TextDecoder().decode(response.Payload);
    const responseJSON = JSON.parse(responseString);

    types = JSON.parse(responseJSON.body);
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

  const client = new Client({
    auth: process.env.NOTION_KEY,
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

  console.log(event);

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
    const promises = mappings?.map((mapping) => {
      return client.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE as string,
        },
        properties: {
          Address: {
            type: "title",
            title: [
              {
                type: "text",
                text: {
                  content: mapping.address,
                },
              },
            ],
          },
          Type: {
            type: "select",
            select: {
              name: mapping.type,
            },
          },
        },
      });
    });

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
