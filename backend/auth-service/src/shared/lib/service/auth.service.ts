import { google } from "googleapis";

export const createAuthService = (credentials: {
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
}) => {
  const oAuth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    credentials.redirectUris[0]
  );

  return {
    generateAuthUrl: (scope: string[]) => {
      return oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope,
      });
    },

    getToken: (code: string) => {
      return oAuth2Client.getToken(code);
    },
  };
};
