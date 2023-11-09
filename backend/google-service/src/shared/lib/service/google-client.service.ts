import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";

export const createGoogleClient = (credentials: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) => {
  return new OAuth2Client(
    credentials.clientId,
    credentials.clientSecret,
    credentials.redirectUri
  );
};
