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
    createSheet: async (name: string) => {
      const drive = google.drive({ version: "v3", auth: oAuth2Client });

      const googleSheetCreateRepsponse = await drive.files.create({
        requestBody: {
          name,
          mimeType: "application/vnd.google-apps.spreadsheet",
        },
      });

      const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

      try {
        const spreadsheet = await sheets.spreadsheets.batchUpdate({
          spreadsheetId: googleSheetCreateRepsponse.data.id!,
        });

        // console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
      } catch (err) {
        // TODO (developer) - Handle exception
        throw err;
      }
    },
  };
};
