import { createGoogleService } from "../shared";

export const handler = async (event: {
  body: {
    fileId: string;
    token: string;
    redirectUri: string;
  };
}): Promise<string | null | undefined | Error> => {
  console.log(event);

  const { token, fileId, redirectUri } = event.body;

  const service = createGoogleService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri,
  });

  const decodedToken = decodeURIComponent(token);

  service.setToken(decodedToken);

  return ((await service.getFileContentById(fileId)).data as Blob).text();
};
