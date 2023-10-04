import {
  createAuthService,
  GOOGLE_DRIVE_FILE_SCOPE,
  GOOGLE_SPREADSHEET_SCOPE,
  GOOGLE_USERINFO_SCOPE,
} from "../shared";

export const handler = async (event: {
  body: { redirectUri: string };
}): Promise<string | Error> => {
  console.log(event);

  const { code, redirectUri } = event.body;

  const authService = createAuthService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri,
  });

  const decodedCode = decodeURIComponent(code);

  try {
    const { tokens } = await authService.getToken(decodedCode);

    console.log("Result tokens:", tokens);

    return tokens;
  } catch (err) {
    console.error("Google Service: error in getting token from code:", err);

    return new Error(
      `Google Service: error in getting token from code: ${err}`
    );
  }
};
