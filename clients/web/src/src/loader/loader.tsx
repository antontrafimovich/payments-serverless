import { useContext } from "react";
import { AppContext } from "../app.provider";
import {
  Box,
  Button,
  Center,
  Container,
  FileInput,
  Group,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export const Loader = () => {
  const { createReport, report } = useContext(AppContext);

  const form = useForm({
    initialValues: {
      bank: "PKO",
      report: null,
    },
  });

  return (
    <Center h='100%'>
      <Container size="30rem" px={0} my="auto">
        <form
          encType="multipart/form-data"
          onSubmit={form.onSubmit((values: any) => {
            const formData = new FormData();
            formData.append("bank", values.bank);
            formData.append("report", values.report);

            createReport?.(formData);
          })}
        >
          {report && report.pending && "Loading..."}
          <Box maw={320} mx="auto">
            <Select
              w="290px"
              label="Select bank"
              placeholder="Pick one"
              data={[
                { value: "pko", label: "PKO" },
                { value: "millenium", label: "Millenium" },
              ]}
              {...form.getInputProps("bank")}
            />
            <FileInput
              w="290px"
              placeholder="Pick file"
              label="Your resume"
              mt="md"
              {...form.getInputProps("report")}
            />

            <Group position="center" mt="xl">
              <Button
                type="submit"
                variant="outline"
                onClick={() => form.values}
              >
                Set random values
              </Button>
            </Group>
          </Box>
        </form>
      </Container>
    </Center>
  );
};
