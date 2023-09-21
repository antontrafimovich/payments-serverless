import {
  AppShell,
  Button,
  Container,
  Flex,
  Header,
  Navbar,
  Stack,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useLocalStorage, useResizeObserver } from "@mantine/hooks";
import {
  ComponentProps,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AppContext } from "../../app";
import {
  download,
  Logo,
  PivotTableIcon,
  popupCenter,
  Report,
  TableIcon,
  withHover,
} from "../../shared";
import { ReportTable } from "../../widgets";

export type ExpensesProps = {
  report: Report;
};

type NavbarLinkProps = {
  icon: FC<ComponentProps<"svg">>;
  label: string;
  onClick: (link: NavbarLinkProps) => void;
};

const NavbarLink = (props: NavbarLinkProps) => {
  const { icon: Icon, label, onClick } = props;

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={() => onClick(props)}>
        <Icon />
      </UnstyledButton>
    </Tooltip>
  );
};
const actionDescriptors: {
  icon: React.FC<ComponentProps<"svg">>;
  label: string;
}[] = [
  { icon: withHover(TableIcon, "#333333"), label: "Plain" },
  { icon: withHover(PivotTableIcon, "#333333"), label: "Pivot" },
];

export const Payments = ({ report }: ExpensesProps) => {
  const [ref, rect] = useResizeObserver();
  const [token] = useLocalStorage({ key: "token" });

  const [userInfo, setUserInfo] = useState<any>(null);

  const { setReport } = useContext(AppContext);

  const [mode, setMode] = useState<"plain" | "pivot">("plain");

  const onDownload = useCallback(() => {
    const data = JSON.stringify(report);
    download(data, "report.json");
  }, [report]);

  useEffect(() => {
    fetch("http://localhost:3000/user-info", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((data) => data.json())
      .then((data) => setUserInfo(data.data));
  }, [token]);

  const actions = useMemo(() => {
    return actionDescriptors.map((action) => (
      <NavbarLink
        {...action}
        onClick={(descriptor) =>
          setMode(descriptor.label === "Plain" ? "plain" : "pivot")
        }
      />
    ));
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
          <Flex justify="space-between" align="center">
            <Logo
              onClick={() => setReport!(null)}
              type="horizontal"
              style={{ width: "171.6px", height: "38.62px" }}
            />
            <Button
              onClick={() =>
                popupCenter({
                  url: "http://localhost:3000/auth",
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
            <Button ml="auto" onClick={onDownload}>
              Download
            </Button>
          </Flex>
        </Header>
      }
    >
      <Container ref={ref} fluid sx={{ height: "100%" }} px={0}>
        <ReportTable mode={mode} report={report} height={rect.height} />
      </Container>
    </AppShell>
  );
};
