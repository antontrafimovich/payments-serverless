import { google } from "googleapis";

export const createAuthService = (credentials: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) => {
  const oAuth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    credentials.redirectUri
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

    setToken: (token: string) => {
      oAuth2Client.setCredentials(JSON.parse(atob(token)));
    },

    getUserInfo: () => {
      const oath2 = google.oauth2({ version: "v2", auth: oAuth2Client });

      return oath2.userinfo.get();
    },
  };
};
