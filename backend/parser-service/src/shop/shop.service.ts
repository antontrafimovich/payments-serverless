export const service = (db: any) => {
  return {
    getAll: async () => {
      const response = await db.query(process.env.NOTION_DATABASE);

      const data = response.results.map((item: any) => {
        return {
          Address: item.properties.Address.title[0].text.content,
          Type: item.properties.Type.select.name,
        };
      });

      return data;
    },
  };
};
