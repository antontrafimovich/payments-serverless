import { Button, Group, Modal, Select, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DataTable } from "mantine-datatable";
import { useContext, useEffect, useState } from "react";

import { AppContext } from "../../app";
import {
  createMapRecord,
  getMapTypes,
  Report,
  useGetNew,
  usePostNew,
} from "../../shared";
import { useData } from "./lib";
import { Payment, Row } from "./model";

export type ReportTableProps = {
  height: number;
  report: Report;
  mode?: "plain" | "pivot";
};

export const ReportTable = ({ height, report }: ReportTableProps) => {
  const { setReport } = useContext(AppContext);

  const { post, pending, data } = usePostNew(createMapRecord);
  const { data: options } = useGetNew(getMapTypes);

  const [paymentToModify, setPaymentToModify] = useState<Payment | null>(null);

  const form = useForm({
    initialValues: {
      address: null,
      type: "Groceries",
    },
  });

  const [columns, rows] = useData({
    report,
    columns: ["Type"],
    rows: ["Date"],
    values: ["Value"],
  });

  useEffect(() => {
    if (!pending && data) {
      const [{ address, type }] = data;

      setReport!((report) => {
        if (!report) {
          return null;
        }

        const { headers, data } = report;

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
    <>
      <DataTable
        rowContextMenu={{
          items: (record: Row) => {
            return [
              {
                key: "delete",
                color: "red",
                title: "Delete",
                onClick: () => {
                  setReport!((report) => {
                    if (!report) {
                      return null;
                    }

                    const { data, headers } = report;

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
                  });
                },
              },
              {
                key: "setType",
                title: "Set Type",
                onClick: () => {
                  setPaymentToModify(record as any);
                },
              },
            ];
          },
        }}
        withBorder
        withColumnBorders
        striped
        highlightOnHover
        height={height}
        scrollAreaProps={{ type: "hover" }}
        columns={columns}
        records={rows}
      />
      <Modal
        opened={!!paymentToModify}
        onClose={() => setPaymentToModify(null)}
        title="Modify Payment"
      >
        <Text>
          Change payment with description{" "}
          <Text span fw={700} inline>
            {paymentToModify?.Counterparty}
          </Text>{" "}
          which happened on day{" "}
          <Text span fw={700} inline>
            {paymentToModify?.Date}
          </Text>
        </Text>

        <form
          onSubmit={form.onSubmit((values) => post(JSON.stringify([values])))}
        >
          <TextInput
            {...form.getInputProps("address")}
            mt="md"
            placeholder="Type the counterparty..."
            label="Counterparty"
          />
          <Select
            label="Type"
            mt="md"
            placeholder="Pick one"
            {...form.getInputProps("type")}
            data={options?.map((option: string) => ({
              value: option,
              label: option,
            }))}
          />

          <Group align="right" mt="md">
            <Button type="submit" loading={pending}>
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};
