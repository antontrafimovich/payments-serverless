export const parse = (csv: string[][]) => {
  const [header, ...rows] = csv;

  return rows.map((item) => {
    return {
      address: item[6],
      date: item[1],
      value: item[7],
    };
  });
};
