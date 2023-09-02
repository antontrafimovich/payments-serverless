import { Select, SelectProps } from "@mantine/core";
import { useEffect, useState } from "react";

import { Bank, getBanks } from "../../../entities";
import { BankOption, mapBankToOption } from "../model";

export const BankSelector = (
  props: Omit<SelectProps & React.RefAttributes<HTMLInputElement>, "data">
) => {
  const [options, setOptions] = useState<BankOption[]>([]);

  useEffect(() => {
    getBanks().then((data: Bank[]) => {
      const bankOptions = data.map(mapBankToOption);

      setOptions(bankOptions);
    });
  }, []);

  return (
    <Select
      label="Select bank"
      placeholder="Pick one"
      defaultValue={options[0]?.value}
      data={options}
      {...props}
    />
  );
};
