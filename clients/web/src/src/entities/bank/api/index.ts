import { Bank } from "../model";

export const getBanks = (): Promise<Bank[]> => {
  return Promise.resolve([
    { id: "pko", label: "PKO" },
    { id: "millenium", label: "Millenium" },
  ]);
};
