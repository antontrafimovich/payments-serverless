import { Client } from "@notionhq/client";

export const createClient = (key: string) => {
  const client = new Client({
    auth: key,
  });

  return {
    query: (databaseId: string) => {
      return client.databases.query({
        database_id: databaseId,
      });
    },
  };
};
