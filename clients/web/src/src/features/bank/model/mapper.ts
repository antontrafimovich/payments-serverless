import { Bank } from "../../../entities";
import { BankOption } from "./bank-option";

export const mapBankToOption = (bank: Bank): BankOption => {
  return {
    label: bank.label,
    value: bank.id,
  };
};
