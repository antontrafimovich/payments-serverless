import { APIGatewayEvent, Handler, APIGatewayProxyHandler } from "aws-lambda";
import { parse } from "papaparse";

import { createClient } from "../app";
import { parseFormData } from "./../shared";
import { service } from "./../shop";

const shops = service(createClient(process.env.NOTION_KEY as string));

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context
) => {
  const formData = event.body;

  if (formData === null) {
    return {
      statusCode: 400,
      body: "File hasn't been provided.",
    };
  }

  const parsedData = parseFormData(formData);

  if (parsedData === null) {
    return {
      statusCode: 500,
      body: "Some problem with file format. Please check carefully file you sent.",
    };
  }

  console.log(parsedData);

  if (parsedData.contentType !== "text/csv") {
    return {
      statusCode: 400,
      body: "File must have a csv format.",
    };
  }

  let content;
  try {
    content = parse(parsedData.content);
  } catch (err) {
    return {
      statusCode: 500,
      body: typeof err === "string" ? err : ((err as any).message as string),
    };
  }

  const shopsMetadata = await shops.getAll();

  console.log(content);

  return {
    statusCode: 200,
    body: JSON.stringify(content),
  };
};
