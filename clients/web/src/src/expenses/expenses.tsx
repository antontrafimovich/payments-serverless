import "./expenses.css";
import "react-data-grid/lib/styles.css";

import { AppShell, Button, Flex, Header, Navbar, Table } from "@mantine/core";
import { useMemo } from "react";

export type ExpensesProps = {
  info: {
    headers: string[];
    data: string[][];
  };
};

export const Expenses = ({ info }: ExpensesProps) => {
  const [columns, rows] = useMemo(() => {
    const columns = info.headers.map((item) => ({
      key: item,
      name: item,
      width: item === "Counterparty" ? 450 : undefined,
    }));

    const rows = info.data.map((row) => {
      return info.headers.reduce((result, next, idx) => {
        return {
          ...result,
          [next]: row[idx],
        };
      }, {} as Record<string, string>);
    });

    return [columns, rows];
  }, [info]);

  const onDownload = () => {
    const data = JSON.stringify(info);
    const base64 = btoa(data);

    const linkSource = `data:application/json;base64,${base64}`;
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = "_self";
    downloadLink.download = "report.json";
    downloadLink.click();
  };

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 40 }} height={500} p="xs">
          {/* Navbar content */}
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Flex justify="flex-end" align="center">
            <Button ml="auto" onClick={onDownload}>
              Download
            </Button>
          </Flex>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: "white",
        },
      })}
    >
      <Table striped withBorder highlightOnHover>
        <thead>
          <tr>
            {columns.map(({ key, name, width }) => {
              return <th key={key}>{name}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => {
                  return (
                    <td key={`${rowIndex}_${columnIndex}`}>
                      {row[column.key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </AppShell>
  );
};
