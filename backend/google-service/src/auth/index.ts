import {
  createGoogleService,
  GOOGLE_DRIVE_FILE_SCOPE,
  GOOGLE_SPREADSHEET_SCOPE,
  GOOGLE_USERINFO_SCOPE,
} from "../shared";

export const handler = async (event: {
  body: { redirectUri: string };
}): Promise<string | Error> => {
  console.log(event);

  const { redirectUri } = event.body;

  const googleService = createGoogleService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri,
  });

  try {
    const authUrl = googleService.generateAuthUrl([
      GOOGLE_DRIVE_FILE_SCOPE,
      GOOGLE_SPREADSHEET_SCOPE,
      GOOGLE_USERINFO_SCOPE,
    ]);

    console.log("Result authUrl:", authUrl);

    return authUrl;
  } catch (err) {
    console.error("Error generating auth URL:", err);

    return new Error(`Error generating auth URL: ${err}`);
  }
};
