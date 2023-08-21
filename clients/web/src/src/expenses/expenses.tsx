import "react-data-grid/lib/styles.css";

import { useMemo } from "react";
import DataGrid from "react-data-grid";

export type ExpensesProps = {
  data: {
    headers: string[];
    data: string[][];
  };
};

export const Expenses = ({ data }: ExpensesProps) => {
  const [columns, rows] = useMemo(() => {
    const columns = data.headers.map((item) => ({
      key: item,
      name: item,
      width: item === "Counterparty" ? 450 : undefined,
    }));

    const rows = data.data.map((row) => {
      return data.headers.reduce((result, next, idx) => {
        return {
          ...result,
          [next]: row[idx],
        };
      }, {});
    });

    return [columns, rows];
  }, [data]);

  return (
    <div className="expenses">
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
};
