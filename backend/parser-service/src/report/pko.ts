const getAddress = (item: string[]) => {
  if (item[7].includes(process.env.PHONE_NUMBER as string)) {
    return item[8];
  }

  if (item[7].includes("Nazwa odbiorcy")) {
    return `${item[7]} ${item[8]}`;
  }

  return item[7];
};

export const parse = (csv: string[][]) => {
  const [header, ...rows] = csv;

  return rows.map((item) => {
    return {
      address: getAddress(item),
      date: item[1],
      value: item[3],
    };
  });
};
