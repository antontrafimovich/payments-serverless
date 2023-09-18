import { Client } from "@notionhq/client";

import { Storage, StorageRecord } from "./model";

export const createNotionStorage = ({ key }: { key: string }): Storage => {
  const client = new Client({
    auth: key,
  });

  return {
    post: async ({ address, type }: StorageRecord) => {
      try {
        await client.pages.create({
          parent: {
            database_id: process.env.NOTION_DATABASE as string,
          },
          properties: {
            Address: {
              type: "title",
              title: [
                {
                  type: "text",
                  text: {
                    content: address,
                  },
                },
              ],
            },
            Type: {
              type: "select",
              select: {
                name: type,
              },
            },
          },
        });
      } catch (err) {
        const error = typeof err === "string" ? new Error(err) : err;
        console.error("Notion client error: ", error);

        throw error;
      }

      return { address, type };
    },
  };
};
