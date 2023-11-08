import { createGoogleService } from "../shared";

export const handler = async (event: {
  body: { redirectUri: string; token: string };
}): Promise<string | Error> => {
  console.log(event);

  const { token, redirectUri } = event.body;

  const googleService = createGoogleService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: `https://${redirectUri}`,
  });

  const decodedToken = decodeURIComponent(token);

  googleService.setToken(decodedToken);

  try {
    const { credentials } = await googleService.refreshToken();

    console.log("Result tokens:", credentials);

    return btoa(JSON.stringify(credentials));
  } catch (err) {
    const error = new Error(
      `Google Service: error in refreshing token: ${err}`
    );

    console.error(error);

    return error;
  }
};
