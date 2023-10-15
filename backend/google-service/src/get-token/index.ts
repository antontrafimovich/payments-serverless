import { createGoogleService } from "../shared";

export const handler = async (event: {
  body: { redirectUri: string; code: string };
}): Promise<string | Error> => {
  console.log(event);

  const { code, redirectUri } = event.body;

  const googleService = createGoogleService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: `https://${redirectUri}`,
  });

  try {
    const { tokens } = await googleService.getToken(code);

    console.log("Result tokens:", tokens);

    return btoa(JSON.stringify(tokens));
  } catch (err) {
    console.error("Google Service: error in getting token from code:", err);

    return new Error(
      `Google Service: error in getting token from code: ${err}`
    );
  }
};
