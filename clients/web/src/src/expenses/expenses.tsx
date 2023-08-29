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

  const [paymentsData, setPaymentsData] = useState<{
    headers: string[];
    data: string[][];
  }>(info);

  const [columns, rows] = useMemo(() => {
    const columns = paymentsData.headers.map<DataTableColumn<Payment>>(
      (item) => {
        return {
          accessor: item,
        };
      }
    );

    const rows = paymentsData.data.map((row) => {
      return paymentsData.headers.reduce((result, next, idx) => {
        return {
          ...result,
          id: generateUid(),
          [next]: row[idx],
        };
      }, {} as Payment);
    });

    return [columns, rows];
  }, [paymentsData]);

  const onDownload = () => {
    const data = JSON.stringify(paymentsData);
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
          rowContextMenu={{
            items: (record: Payment) => {
              return [
                {
                  key: "delete",
                  color: "red",
                  title: "Delete",
                  onClick: () => {
                    setPaymentsData(
                      ({
                        headers,
                        data,
                      }: {
                        headers: string[];
                        data: string[][];
                      }) => {
                        const removedRowIndex = data.findIndex(
                          ([id]) => id === record.Id
                        );

                        return {
                          headers,
                          data: [
                            ...data.slice(0, removedRowIndex),
                            ...data.slice(removedRowIndex + 1),
                          ],
                        };
                      }
                    );
                  },
                },
              ];
            },
          }}
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
