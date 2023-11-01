import {
  AppShell,
  Box,
  Button,
  Center,
  Container,
  Divider,
  FileInput,
  Group,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";

import { AppContext } from "../../app";
import { BankSelector, ReadyReportLoader } from "../../features";
import { Logo, popupCenter } from "../../shared";

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
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h={"100%"} gap="sm" justify="flex-end">
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
      </AppShell.Header>
      <AppShell.Main py={"auto"}>
        {/* <Center > */}
        <Stack maw={320} mx={"auto"}>
          <Container mb="md">
            <Logo style={{ width: "247.4px", height: "228.69px" }} />
          </Container>
          <form
            encType="multipart/form-data"
            onSubmit={form.onSubmit((values: any) => {
              createReport?.(values.report, values.bank);
            })}
          >
            <Box mx="auto">
              <BankSelector w="290px" {...form.getInputProps("bank")} />
              <FileInput
                w="290px"
                placeholder="Pick file"
                label="Add bank report"
                mt="md"
                {...form.getInputProps("report")}
              />

              <Center mt="xl">
                <Button
                  type="submit"
                  onClick={() => form.values}
                  loading={report ? report.pending ?? undefined : undefined}
                >
                  Send
                </Button>
              </Center>
            </Box>
          </form>
          <Divider my="md" label="OR" labelPosition="center" />
          <Center>
            <ReadyReportLoader reportLoaded={loadReport!} />
          </Center>
        </Stack>
        {/* </Center> */}
      </AppShell.Main>
    </AppShell>
  );
};
