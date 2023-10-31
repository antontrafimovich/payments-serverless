import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { parse } from "papaparse";

import { stringToError, toResponse } from "../shared";
import { createGoogleService } from "../shared/service/google.service";
import { createClient } from "./app";
import { merge } from "./merge";
import { parse as milParse } from "./report/mil";
import { parse as pkoParse } from "./report/pko";
import { isFormDataFile, isFormDataString, parseFormData } from "./shared";
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

  console.log(event);

  const [, token] = event.headers["Authorization"]?.split("Bearer ")!;

  if (!token) {
    return stringToError("User is not authenticated", 401);
  }

  if (formData === null) {
    return stringToError("File hasn't been provided.", 400);
  }

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

  const resultData = merge(paymentsData, shopsMetadata);

  const googleService = createGoogleService();

  const sheet = await googleService.createStorage(
    ".moneytrack",
    token,
    [
      ["Id", "Value", "Date", "Type", "Counterparty"],
      ...(resultData as string[][]),
    ],
    process.env.GOOGLE_REDIRECT_URI!
  );

  console.log(sheet);

  return toResponse({
    statusCode: 200,
    body: JSON.stringify({
      headers: ["Id", "Value", "Date", "Type", "Counterparty"],
      data: resultData,
    }),
  });
};
