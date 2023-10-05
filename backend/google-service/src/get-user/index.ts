import { createAuthService } from "../shared";

export const handler = async (event: {
  body: { token: string; redirectUri: string };
}): Promise<Record<string, any> | Error> => {
  console.log(event);

  const { token, redirectUri } = event.body;

  const authService = createAuthService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri,
  });

  const decodedToken = decodeURIComponent(token);

  authService.setToken(decodedToken);

  return authService.getUserInfo();
};
