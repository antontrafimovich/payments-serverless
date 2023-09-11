import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { parse } from "papaparse";

import { createClient } from "./app";
import { parse as milParse } from "./report/mil";
import { parse as pkoParse } from "./report/pko";
import {
  isFormDataFile,
  isFormDataString,
  parseFormData,
  stringToError,
  toResponse,
} from "./shared";
import { service } from "./shop";
import { Shop } from "./shop/shop.model";

const mapDb = createClient(process.env.NOTION_KEY as string);
const shops = service(mapDb);

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
    return stringToError("File hasn't been provided.", 400);
  }

  console.log(formData);

  const parsedData = parseFormData(formData, event.headers["content-type"]);

  if (parsedData === null) {
    return stringToError(
      "Some problem with file format. Please check carefully file you've sent.",
      500
    );
  }

  const { bank, report } = parsedData;

  if (!isFormDataFile(report)) {
    return stringToError("Report must be a csv file.", 400);
  }

  if (!isFormDataString(bank)) {
    return stringToError("Bank must be a string.", 400);
  }

  if (bank !== "pko" && bank !== "millenium") {
    return stringToError("This bank is not supported yet.", 400);
  }

  if (report.contentType !== "text/csv") {
    return stringToError("File must have a csv format.", 400);
  }

  let content;
  try {
    content = parse<string[]>(report.content);
  } catch (err) {
    return stringToError(
      typeof err === "string" ? err : ((err as any).message as string),
      500
    );
  }

  let shopsMetadata: Shop[];
  try {
    shopsMetadata = await shops.getAll();
  } catch (err) {
    return stringToError(
      `Notion Error: ${typeof err === "string" ? err : (err as Error).message}`,
      500
    );
  }

  const parser = getParser(bank);

  const paymentsData = parser(content.data);

  const resultData = paymentsData.map((item, index) => {
    const shopInfo = shopsMetadata.find((shopInfo) => {
      const addressWords = shopInfo.address.split(" ");

      return addressWords.every((word) =>
        item.address.toLowerCase().includes(word.toLowerCase())
      );
    });

    let counterparty = shopInfo?.address;

    if (!shopInfo) {
      counterparty = item.address;
    }

    return [index, item.value, item.date, shopInfo?.type, counterparty];
  });

  return toResponse({
    statusCode: 200,
    body: JSON.stringify({
      headers: ["Id", "Value", "Date", "Type", "Counterparty"],
      data: resultData,
    }),
  });
};
