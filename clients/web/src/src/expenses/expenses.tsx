import "./expenses.css";
import "react-data-grid/lib/styles.css";

import {
  AppShell,
  Button,
  Flex,
  Header,
  Modal,
  Navbar,
  Table,
  Text,
} from "@mantine/core";
import { useMemo, useState } from "react";

import { download } from "../shared";
import {
  MRT_Column,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";

export type ExpensesProps = {
  info: {
    headers: string[];
    data: string[][];
  };
};

type Payment = {
  Id: string;
  Value: string;
  Date: string;
  Type: string;
  Counterparty: string;
};

type EditTypeData = {
  payment: Payment;
};

export const Expenses = ({ info }: ExpensesProps) => {
  const [isModalOpened, toggleModal] = useState<boolean>(false);

  const [editTypeData, setEditTypeData] = useState<EditTypeData | null>(null);

  const [columns, rows] = useMemo(() => {
    const columns = info.headers.map((item) => {
      if (item === "Type") {
        return {
          accessorKey: item,
          header: item,
          Cell: ({
            renderedCellValue,
            row,
          }: {
            renderedCellValue: any;
            row: any;
          }) => {
            console.log(row);
            return !row.original["Type"] ? (
              <Text component="strong">
                {renderedCellValue}{" "}
                <span
                  onClick={() => setEditTypeData({ payment: row.original })}
                >
                  E
                </span>
              </Text>
            ) : (
              renderedCellValue
            );
          },
          // width: item === "Counterparty" ? 450 : undefined,
        };
      }
      return {
        accessorKey: item,
        header: item,
        // width: item === "Counterparty" ? 450 : undefined,
      };
    });

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
    download(data, "report.json");
  };

  const table = useMantineReactTable({
    columns,
    data: rows, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: true, //enable some features
    enableTopToolbar: false,
    enableStickyHeader: true,
    enableColumnActions: false,
    createDisplayMode: "modal",
    initialState: {
      density: "xs",
    },
    enablePagination: false,
    enableGlobalFilter: false, //turn off a feature
  });

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 40 }} p="xs">
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
      <MantineReactTable table={table} />
      {/* <Table striped withBorder highlightOnHover>
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
      </Table> */}

      <Modal opened={!!editTypeData} onClose={close} title="Authentication">
        {/* Modal content */}
      </Modal>
    </AppShell>
  );
};
