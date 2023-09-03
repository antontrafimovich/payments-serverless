import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  FileButton,
  FileInput,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext } from "react";

import { AppContext } from "../../app";
import { BankSelector, ReadyReportLoader } from "../../features";

export const Loader = () => {
  const { createReport, report, loadReport } = useContext(AppContext);

  const form = useForm({
    initialValues: {
      bank: "PKO",
      report: null,
    },
  });

  return (
    <Center h="100%">
      <Container size="30rem" px={0} my="auto">
        <Center>
          <img src="/logo.png" width="240" height="240" />
        </Center>
        <form
          encType="multipart/form-data"
          onSubmit={form.onSubmit((values: any) => {
            const formData = new FormData();
            formData.append("bank", values.bank);
            formData.append("report", values.report);

            createReport?.(formData);
          })}
        >
          <Box maw={320} mx="auto">
            <BankSelector w="290px" {...form.getInputProps("bank")} />
            <FileInput
              w="290px"
              placeholder="Pick file"
              label="Add bank report"
              mt="md"
              {...form.getInputProps("report")}
            />

            <Group position="center" mt="xl">
              <Button
                type="submit"
                onClick={() => form.values}
                loading={report ? report.pending ?? undefined : undefined}
              >
                Send
              </Button>
            </Group>
          </Box>
        </form>
        <Divider my="md" label="OR" labelPosition="center" />
        <Group position="center">
          <ReadyReportLoader reportLoaded={loadReport!} />
        </Group>
      </Container>
    </Center>
  );
};
