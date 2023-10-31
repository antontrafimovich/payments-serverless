import { Shop } from "./shop.model";

export const service = (db: any) => {
  return {
    getAll: async (): Promise<Shop[]> => {
      const response = await db.query(process.env.NOTION_DATABASE);

      const data = response.results
        .map((item: any) => {
          const [title] = item.properties.Address.title;

          if (!title.text) {
            return null;
          }

          return {
            address: item.properties.Address.title[0].text.content,
            type: item.properties.Type.select.name,
          };
        })
        .filter((item: any) => item !== null);

      return data;
    },
  };
};
