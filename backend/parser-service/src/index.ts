import { APIGatewayEvent, Handler, APIGatewayProxyHandler } from "aws-lambda";
import { parse } from "papaparse";
import { parse as pkoParse } from "./report/pko";

import { createClient } from "./app";
import { parseFormData, toCsv } from "./shared";
import { service } from "./shop";
import { Shop } from "./shop/shop.model";

const shops = service(createClient(process.env.NOTION_KEY as string));

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
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

  if (parsedData.contentType !== "text/csv") {
    return {
      statusCode: 400,
      body: "File must have a csv format.",
    };
  }

  let content;
  try {
    content = parse<string[]>(parsedData.content).data;
  } catch (err) {
    return {
      statusCode: 500,
      body: typeof err === "string" ? err : ((err as any).message as string),
    };
  }

  let shopsMetadata: Shop[];
  try {
    shopsMetadata = await shops.getAll();
  } catch (err) {
    return {
      statusCode: 500,
      body: `Notion Error: ${
        typeof err === "string" ? err : (err as Error).message
      }`,
    };
  }

  const paymentsData = pkoParse(content);

  const resultData = paymentsData.map((item, index) => {
    const shopInfo = shopsMetadata.find((shopInfo) => {
      const addressWords = shopInfo.address.split(" ");

      return addressWords.every((word) => item.address.includes(word));
    });

    let counterparty = shopInfo?.address;

    if (!shopInfo) {
      counterparty = item.address;
    }

    return [index, item.value, item.date, shopInfo?.type, counterparty];
  });

  const csv = toCsv(
    ["Id", "Value", "Date", "Type", "Counterparty"],
    resultData
  );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/csv'
    },
    body: csv,
  };
};
