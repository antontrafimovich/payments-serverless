export const INCORRECT_BODY_FORMAT_ERROR = Error("Incorrect body format");
export const UNAUTHORIZED_ERROR = Error("User is not authorized");
export const createNewCredsGenerationError = (message: string) => {
  return new Error(`Generate new creds: ${message}`);
};
export const GENERATE_NEW_CREDS_ERROR = Error("User is not authorized");
