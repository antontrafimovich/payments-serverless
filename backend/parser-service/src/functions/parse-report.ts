import { APIGatewayEvent, Handler } from "aws-lambda";
import { parse } from "papaparse";
import { parseFormData } from "./../shared";

export const handler = async (event: APIGatewayEvent) => {
  const formData = event.body;

  if (formData === null) {
    return {
      statusCode: 400,
      error: "File hasn't been provided",
    };
  }

  console.log(formData);

  const parsedData = parseFormData(formData);

  if (parsedData === null) {
    return {
      statusCode: 500,
      error:
        "Some problem with file format. Please check carefully file you sent",
    };
  }

  if (parsedData.contentType !== "text/csv") {
    return {
      statusCode: 404,
      error: "File must havebe in a csv format",
    };
  }

  const content = parse(parsedData.content);

  return {
    statusCode: 200,
    body: content,
  };
};
