import { createGoogleClient } from "../shared/lib/service/google-client.service";
import {
  NO_REDIRECT_URI_ERROR,
  NO_TOKEN_ERROR,
  createRefreshTokenError,
} from "./lib/error";

const parseToken = (token: string) => {
  const decodedBase64Token = decodeURIComponent(token);
  const decodedToken = atob(decodedBase64Token);

  return JSON.parse(decodedToken);
};

export const handler = async (event: {
  body: { redirectUri: string; token: string };
}): Promise<string | Error> => {
  console.log(event);

  const { token, redirectUri } = event.body;

  if (!redirectUri) {
    throw NO_REDIRECT_URI_ERROR;
  }

  if (!token) {
    throw NO_TOKEN_ERROR;
  }

  const client = createGoogleClient({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: `https://${redirectUri}`,
  });

  const creds = parseToken(token);

  client.setCredentials(creds);

  try {
    const { credentials } = await client.refreshAccessToken();

    console.log("Result tokens:", credentials);

    return btoa(JSON.stringify(credentials));
  } catch (err) {
    const error = createRefreshTokenError((err as Error).message);
    console.error(error);

    throw error;
  }
};
