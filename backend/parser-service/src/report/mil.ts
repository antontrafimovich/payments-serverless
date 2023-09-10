export const parse = (csv: string[][]) => {
  const [_, ...rows] = csv;

  return rows.reduce<{ address: string; date: string; value: string }[]>(
    (result, item) => {
      const address = item[6];
      const date = item[1];
      const value = item[7];

      if (!address) {
        return result;
      }

      return [...result, { address, date, value }];
    },
    []
  );
};
