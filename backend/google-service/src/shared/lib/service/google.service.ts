import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import { drive as googleDrive } from "googleapis/build/src/apis/drive";
import { oauth2 } from "googleapis/build/src/apis/oauth2";
import { sheets as googleSheets } from "googleapis/build/src/apis/sheets";

export const createGoogleService = (credentials: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) => {
  const oAuth2Client = new OAuth2Client(
    credentials.clientId,
    credentials.clientSecret,
    credentials.redirectUri
  );

  const checkFileExists = async (fileName: string) => {
    const drive = googleDrive({ version: "v3", auth: oAuth2Client });

    try {
      const response = await drive.files.list({
        q: `name='${fileName}'`,
      });

      console.log("Files:", response.data.files);

      return response.data.files ? response.data.files.length > 0 : false;
    } catch (error) {
      console.error("Error checking if the file exists:", error);
      return false;
    }
  };

  const addDataToSheet = async (sheetId: string, values: string[][]) => {
    const sheets = googleSheets({ version: "v4", auth: oAuth2Client });

    try {
      const spreadsheet = await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: "A1:A5",
        valueInputOption: "RAW",
        requestBody: {
          values,
        },
      });

      return spreadsheet.data.spreadsheetId;
      // console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  };

  return {
    generateAuthUrl: (scope: string[]) => {
      return oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope,
        prompt: 'consent'
      });
    },

    getToken: (code: string) => {
      return oAuth2Client.getToken(code);
    },

    setToken: (token: string) => {
      const creds = JSON.parse(atob(token));
      console.log("creds:", creds);
      oAuth2Client.setCredentials(creds);
    },

    refreshToken: () => {
      return oAuth2Client.refreshAccessToken();
    },

    getUserInfo: () => {
      const oath2 = oauth2({ version: "v2", auth: oAuth2Client });

      return oath2.userinfo.get();
    },

    createFolder: async (name: string) => {
      const drive = googleDrive({ version: "v3", auth: oAuth2Client });

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

    createSheet: async (name: string, data: string[][]) => {
      if (await checkFileExists(name)) {
        throw new Error(
          `Google service error: file with name ${name} already exists`
        );
      }

      const drive = googleDrive({ version: "v3", auth: oAuth2Client });

      const googleSheetCreateRepsponse = await drive.files.create({
        requestBody: {
          name,
          mimeType: "application/vnd.google-apps.spreadsheet",
        },
      });

      const result = await addDataToSheet(
        googleSheetCreateRepsponse.data.id as string,
        data
      );

      return googleSheetCreateRepsponse.data.id;
    },

    addDataToSheet,

    getFileListByName: async (name: string) => {
      const drive = googleDrive({ version: "v3", auth: oAuth2Client });

      try {
        const response = await drive.files.list({
          q: `name contains '${name}'`,
        });

        console.log("Files:", response.data.files);

        return response.data.files;
      } catch (error) {
        console.error("Error checking if the file exists:", error);
        throw error;
      }
    },

    getFileContentById: async (fileId: string) => {
      const drive = googleDrive({ version: "v3", auth: oAuth2Client });

      try {
        const response = await drive.files.export({
          fileId,
          mimeType: "text/csv",
        });

        console.log("fileContent:", response);

        return response;
      } catch (error) {
        console.error("Error checking if the file exists:", error);
        throw error;
      }
    },

    getDataFromSheet: async (sheetId: string) => {
      const sheets = googleSheets({ version: "v4", auth: oAuth2Client });

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
