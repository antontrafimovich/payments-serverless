import { APIGatewayEvent } from "aws-lambda";
import { parse } from "papaparse";

import { parseFormData } from "./../shared";

export const handler = async (event: APIGatewayEvent) => {
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

  const content = parse(parsedData.content);

  return {
    statusCode: 200,
    body: content,
  };
};
