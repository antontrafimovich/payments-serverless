import { Client } from "@notionhq/client";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const client = new Client({
    auth: process.env.NOTION_KEY,
  });

  let data;

  try {
    data = await client.databases.query({
      database_id: process.env.NOTION_DATABASE as string,
    });
  } catch (err) {
    return {
      statusCode: 500,
      body: typeof err === "string" ? err : (err as Error).message,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};
