import { createGoogleService } from "../shared";

export const handler = async (event: {
  body: {
    fileName: string;
    token: string;
    redirectUri: string;
  };
}): Promise<{ id: string; name: string }[] | null | undefined | Error> => {
  console.log(event);

  const { token, fileName, redirectUri } = event.body;

  const service = createGoogleService({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri,
  });

  const decodedToken = decodeURIComponent(token);

  service.setToken(decodedToken);

  return (await service.getFileListByName(fileName))?.map((file) => ({
    id: file.id!,
    name: file.name!,
  }));
};
