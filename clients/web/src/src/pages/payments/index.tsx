import {
  AppShell,
  Button,
  Container,
  Flex,
  Group,
  Header,
  Modal,
  Navbar,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useResizeObserver } from "@mantine/hooks";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { ComponentProps, FC, useEffect, useMemo, useState } from "react";

import {
  apiPaths,
  download,
  generateUid,
  PivotTableIcon,
  TableIcon,
  useGet,
  usePost,
  withHover,
} from "../../shared";

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

type NavbarLinkProps = {
  icon: FC<ComponentProps<"svg">>;
  label: string;
};

const NavbarLink = ({ icon: Icon, label }: NavbarLinkProps) => {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton>
        <Icon />
      </UnstyledButton>
    </Tooltip>
  );
};
const actionDescriptors: {
  icon: React.FC<ComponentProps<"svg">>;
  label: string;
}[] = [
  { icon: withHover(TableIcon, "red"), label: "Plain" },
  { icon: withHover(PivotTableIcon, "red"), label: "Pivot" },
];

export const Payments = ({ info }: ExpensesProps) => {
  const [ref, rect] = useResizeObserver();

  const { post, pending, data } = usePost(apiPaths.map + "/map/record");

  const { data: options } = useGet(apiPaths.map + "/map/types");

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

  const actions = useMemo(() => {
    return actionDescriptors.map((action) => <NavbarLink {...action} />);
  }, [actionDescriptors]);

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 40 }} py="xs" px={8}>
          <Navbar.Section>
            <Stack>{actions}</Stack>
          </Navbar.Section>
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
      <Container ref={ref} fluid sx={{ height: "100%" }} px={0}>
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
    </AppShell>
  );
};
