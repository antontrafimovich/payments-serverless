const getValueFromPayment = (payment: string[]) => {
  return payment[7] || payment[8];
};

const getCptyDescription = (payment: string[]) => {
  if (!payment[5] && !payment[6]) {
    return null;
  }

  return `${payment[5]} ${payment[6]}`;
};

export const parse = (csv: string[][]) => {
  const [_, ...rows] = csv;

  return rows.reduce<{ address: string; date: string; value: string }[]>(
    (result, item) => {
      const address = getCptyDescription(item);
      const date = item[1];
      const value = getValueFromPayment(item);

      if (!address) {
        return result;
      }

      return [...result, { address, date, value }];
    },
    []
  );
};
