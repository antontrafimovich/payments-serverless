import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { parse } from "papaparse";

import { createClient } from "./app";
import { parse as milParse } from "./report/mil";
import { parse as pkoParse } from "./report/pko";
import { isFormDataFile, isFormDataString, parseFormData } from "./shared";
import { service } from "./shop";
import { Shop } from "./shop/shop.model";

const shops = service(createClient(process.env.NOTION_KEY as string));

const getParser = (bank: "pko" | "millenium") => {
  if (bank === "pko") {
    return pkoParse;
  }

  return milParse;
};

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const formData = event.body;

  if (formData === null) {
    return {
      statusCode: 400,
      body: "File hasn't been provided.",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  console.log(formData);

  const parsedData = parseFormData(formData, event.headers["content-type"]);

  if (parsedData === null) {
    return {
      statusCode: 500,
      body: "Some problem with file format. Please check carefully file you sent.",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  const { bank, report } = parsedData;

  if (!isFormDataFile(report)) {
    return {
      statusCode: 400,
      body: "Report must be a csv file.",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  if (!isFormDataString(bank)) {
    return {
      statusCode: 400,
      body: "Bank must be a string",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  if (bank !== "pko" && bank !== "millenium") {
    return {
      statusCode: 400,
      body: "This bank is not supported yet",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  if (report.contentType !== "text/csv") {
    return {
      statusCode: 400,
      body: "File must have a csv format.",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  let content;
  try {
    content = parse<string[]>(report.content);
  } catch (err) {
    return {
      statusCode: 500,
      body: typeof err === "string" ? err : ((err as any).message as string),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }

  const parser = getParser(bank);

  const paymentsData = parser(content.data);

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

  // const csv = toCsv(
  //   ["Id", "Value", "Date", "Type", "Counterparty"],
  //   resultData
  // );

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      headers: ["Id", "Value", "Date", "Type", "Counterparty"],
      data: resultData,
    }),
  };
};
