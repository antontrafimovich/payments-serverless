import { createGoogleService } from "../shared";

export const handler = async (event: {
  body: { id: string; token: string; redirectUri: string; data: string[][] };
}): Promise<string | null | undefined | Error> => {
  console.log(event);

  const { token, id, redirectUri, data } = event.body;

  const service = createGoogleService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri,
  });

  const decodedToken = decodeURIComponent(token);

  service.setToken(decodedToken);

  return service.addDataToSheet(id, data);
};
