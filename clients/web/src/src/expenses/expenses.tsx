import "./expenses.css";

import {
  AppShell,
  Button,
  Container,
  Flex,
  Header,
  Navbar,
} from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useMemo, useState } from "react";

import { download, generateUid } from "../shared";

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

export const Expenses = ({ info }: ExpensesProps) => {
  const [ref, rect] = useResizeObserver();

  const [selectedRecords, setSelectedRecords] = useState<Payment[]>([]);

  const [columns, rows] = useMemo(() => {
    const columns = info.headers.map<DataTableColumn<Payment>>((item) => {
      return {
        accessor: item,
      };
    });

    const rows = info.data.map((row) => {
      return info.headers.reduce((result, next, idx) => {
        return {
          ...result,
          id: generateUid(),
          [next]: row[idx],
        };
      }, {} as Payment);
    });

    return [columns, rows];
  }, [info]);

  const onDownload = () => {
    const data = JSON.stringify(info);
    download(data, "report.json");
  };

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
    >
      <Container ref={ref} fluid sx={{ height: "100%" }}>
        <DataTable
          withBorder
          withColumnBorders
          striped
          highlightOnHover
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          height={rect.height}
          scrollAreaProps={{ type: "hover" }}
          columns={columns}
          records={rows}
        />
      </Container>
    </AppShell>
  );
};
