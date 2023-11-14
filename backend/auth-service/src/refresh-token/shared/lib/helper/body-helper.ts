import { DEFAULT_AUTH_TYPE } from "../constants";
import { INCORRECT_BODY_FORMAT_ERROR } from "../errors";

export const getAuthTypeFromEventBody = (body: string | null) => {
  if (!body) {
    return DEFAULT_AUTH_TYPE;
  }

  let bodyParsed;

  try {
    bodyParsed = JSON.parse(body);
  } catch (err) {
    throw INCORRECT_BODY_FORMAT_ERROR;
  }

  const { type } = bodyParsed;

  return type ?? DEFAULT_AUTH_TYPE;
};
