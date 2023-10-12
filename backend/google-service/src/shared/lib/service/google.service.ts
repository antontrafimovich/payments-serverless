import { google } from "googleapis";

export const createGoogleService = (credentials: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) => {
  const oAuth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    credentials.redirectUri
  );

  const checkFileExists = async (fileName: string) => {
    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    try {
      const response = await drive.files.list({
        q: `name='${fileName}'`,
      });
      return response.data.files ? response.data.files.length > 0 : false;
    } catch (error) {
      console.error("Error checking if the file exists:", error);
      return false;
    }
  };

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

    createFolder: async (name: string) => {
      const drive = google.drive({ version: "v3", auth: oAuth2Client });

      const folderMeta = {
        name,
        mimeType: "application/vnd.google-apps.folder",
      };

      const googleDriveFolderCreateResponse = await drive.files.create({
        requestBody: folderMeta,
      });

      console.log("Folder id:", googleDriveFolderCreateResponse.data.id);

      return googleDriveFolderCreateResponse.data.id;
    },

    createSheet: async (name: string, folder: string, content: string) => {
      if (await checkFileExists(name)) {
        throw new Error(
          `Google service error: file with name ${name} already exists`
        );
      }

      const drive = google.drive({ version: "v3", auth: oAuth2Client });

      const googleSheetCreateRepsponse = await drive.files.create({
        requestBody: {
          name,
          mimeType: "application/vnd.google-apps.spreadsheet",
          parents: [folder],
        },
        media: {
          mimeType: "application/vnd.google-apps.spreadsheet",
          body: content,
        },
      });

      return googleSheetCreateRepsponse.data.id;
    },

    addDataToSheet: async (sheetId: string, data: string[][]) => {
      const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

      try {
        const spreadsheet = await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: "Sheet1",
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",
          requestBody: {
            values: data,
          },
        });

        return spreadsheet.data.spreadsheetId;
        // console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
      } catch (err) {
        // TODO (developer) - Handle exception
        throw err;
      }
    },

    getDataFromSheet: async (sheetId: string) => {
      const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

      try {
        const spreadsheet = await sheets.spreadsheets.getByDataFilter({
          spreadsheetId: sheetId,
          requestBody: {
            dataFilters: [
              {
                a1Range: "A1:A",
              },
            ],
          },
        });

        return spreadsheet.data.spreadsheetId;
      } catch (err) {
        // TODO (developer) - Handle exception
        throw err;
      }
    },
  };
};
