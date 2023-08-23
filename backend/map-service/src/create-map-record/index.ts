import { Client } from "@notionhq/client";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { array, mixed, object, string, InferType } from "yup";

const bodySchema = array(
  object({
    address: string().required(),
    type: mixed<string>().oneOf(["Home", "Groceries"]).required(),
  })
).required();

type Mappings = InferType<typeof bodySchema>;

const validate = (v: unknown) => {
  return bodySchema.validate(v);
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
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

  let mappings: Mappings;

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

  let result;

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

    result = await Promise.all(promises);
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
    body: JSON.stringify(result),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
};
