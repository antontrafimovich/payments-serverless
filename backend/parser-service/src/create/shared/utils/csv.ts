import { EOL } from "node:os";

export const toCsv = (
  headers: string[],
  values: (string | number | undefined)[][]
): string => {
  return (
    headers.join(",") + EOL + values.map((value) => value.join(",")).join(EOL)
  );
};
