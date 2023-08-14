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

  return rows.reduce((result, next) => {
    const [, date, , value] = next;

    if (!date || !value) {
      return result;
    }

    return [
      ...result,
      {
        address: getAddress(next),
        date: next[1],
        value: next[3],
      },
    ];
  }, [] as { address: string; date: string; value: string }[]);
};
