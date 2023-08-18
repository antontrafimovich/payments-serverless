export type ExpensesProps = {
  data: {
    header: string[];
    data: string[][];
  };
};

export const Expenses = ({ data }: ExpensesProps) => {
  return <>{JSON.stringify(data)}</>;
};
