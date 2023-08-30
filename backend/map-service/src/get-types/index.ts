import { Client } from "@notionhq/client";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const client = new Client({
    auth: process.env.NOTION_KEY,
  });

  let options: string[] = [];

  try {
    const database = await client.databases.retrieve({
      database_id: process.env.NOTION_DATABASE as string,
    });

    const typeColumn = database.properties["Type"];

    if (typeColumn.type === "select") {
      options = typeColumn.select.options.map((option) => option.name);
    }
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
    body: JSON.stringify(options),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };
};
