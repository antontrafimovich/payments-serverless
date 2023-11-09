export const NO_REDIRECT_URI_ERROR = new Error(
  "Redirect uri hasn't been provided"
);
export const NO_TOKEN_ERROR = new Error("Token hasn't been provided");
export const createRefreshTokenError = (details: string) => {
  return new Error(
    `GoogleService refreshToken: error in internal refreshing process: ${details}`
  );
};
