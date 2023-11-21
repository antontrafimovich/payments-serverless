import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { stringToError } from "../shared";

export const withRequiredParam = (
  handler: (event: APIGatewayEvent) => Promise<APIGatewayProxyResult>,
  param: string
) => {
  return (event: APIGatewayEvent) => {
    if (!event.pathParameters) {
      return Promise.resolve(stringToError(`${param} is not provided`, 400));
    }

    const paramValue = event.pathParameters[param];

    if (!paramValue) {
      return Promise.resolve(stringToError(`${param} is not provided`, 400));
    }

    return handler(event);
  };
};
