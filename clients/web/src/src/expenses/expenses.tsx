import "./expenses.css";

import {
  AppShell,
  Button,
  Container,
  Flex,
  Header,
  Modal,
  Navbar,
  Text,
  Select,
  Group,
  TextInput,
} from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";

import { apiPaths, download, generateUid, usePost } from "../shared";
import { useForm } from "@mantine/form";

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

  const { post, pending, data } = usePost(apiPaths.map + "/map");

  const [paymentToModify, setPaymentToModify] = useState<Payment | null>(null);

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

  const form = useForm({
    initialValues: {
      address: null,
      type: "Groceries",
    },
  });

  useEffect(() => {
    if (!pending && data) {
      const [{ address, type }] = data;

      setPaymentsData(({ headers, data }) => {
        const updatedItem = data.findIndex(
          (item) => item[0] === paymentToModify?.Id
        );

        const newItem = [
          ...data[updatedItem].slice(0, 3),
          type,
          address,
        ] as string[];

        return {
          headers,
          data: [
            ...data.slice(0, updatedItem),
            newItem,
            ...data.slice(updatedItem + 1),
          ],
        };
      });

      setPaymentToModify(null);

      form.reset();
    }
  }, [pending, data]);

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
                {
                  key: "setType",
                  title: "Set Type",
                  onClick: () => {
                    setPaymentToModify(record);
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

      <Modal
        opened={!!paymentToModify}
        onClose={() => setPaymentToModify(null)}
        title="Modify Payment"
      >
        <Text>
          Change payment with description{" "}
          <Text fw={700}>${paymentToModify?.Counterparty}</Text> which happened
          on day <Text fw={700}>${paymentToModify?.Date}</Text>
        </Text>

        <form
          onSubmit={form.onSubmit((values) => post(JSON.stringify([values])))}
        >
          <TextInput
            {...form.getInputProps("address")}
            placeholder="Type the counterparty..."
            label="Counterparty"
          />
          <Select
            label="Type"
            placeholder="Pick one"
            {...form.getInputProps("type")}
            data={[
              { value: "Home", label: "Home" },
              { value: "Groceries", label: "Groceries" },
            ]}
          />

          <Group align="right">
            <Button type="submit" loading={pending}>
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
    </AppShell>
  );
};
