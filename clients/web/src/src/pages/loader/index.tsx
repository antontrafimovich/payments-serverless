import {
  AppShell,
  Box,
  Button,
  Center,
  Container,
  Divider,
  FileInput,
  Group,
  Header,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";

import { AppContext } from "../../app";
import { BankSelector, ReadyReportLoader } from "../../features";
import { Logo, popupCenter } from "../../shared";
import { useLocalStorage } from "@mantine/hooks";

export const Loader = () => {
  const { createReport, report, loadReport } = useContext(AppContext);

  const form = useForm({
    initialValues: {
      bank: "PKO",
      report: null,
    },
  });

  const [token] = useLocalStorage({ key: "token" });

  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    fetch(
      "https://hmgnhh3uy2.execute-api.eu-central-1.amazonaws.com/prod/user",
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
      .then((data) => data.json())
      .then((data) => setUserInfo(data.data));
  }, [token]);

  return (
    <AppShell
      header={
        <Header height={60} p="xs">
          <Group align="center" spacing="sm" position="right">
            <Button
              onClick={() =>
                popupCenter({
                  url: "https://7nbmfhr8y9.execute-api.eu-central-1.amazonaws.com/prod/auth",
                  title: "Google Auth",
                  w: 520,
                  h: 570,
                })
              }
            >
              Login
            </Button>
            <Button
              onClick={() =>
                fetch("http://localhost:3000/sheet", {
                  method: "POST",
                  headers: {
                    authorization: `Bearer ${localStorage.getItem("token")!}`,
                  },
                })
              }
            >
              Create Sheet
            </Button>
            {userInfo?.name || "Noname"}
          </Group>
        </Header>
      }
    >
      <Center h="100%">
        <Container size="30rem" px={0} my="auto">
          <Center mb="md">
            <Logo style={{ width: "247.4px", height: "228.69px" }} />
          </Center>
          <form
            encType="multipart/form-data"
            onSubmit={form.onSubmit((values: any) => {
              createReport?.(values.report, values.bank);
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
    </AppShell>
  );
};
