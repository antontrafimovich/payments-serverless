import {
  AppShell,
  Container,
  Flex,
  Stack,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import { ComponentProps, FC, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Logo,
  PivotTableIcon,
  Report,
  TableIcon,
  withHover,
} from "../../shared";
import { useLocalStorage } from "../../shared/lib/hooks/local-storage";
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

export const Payments = () => {
  const [ref, rect] = useResizeObserver();
  const [token] = useLocalStorage("token");
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<any>(null);

  // const { setReport } = useContext(AppContext);

  const [report, setReport] = useState<Report>();

  const [mode, setMode] = useState<"plain" | "pivot">("plain");

  useEffect(() => {
    if (reportId) {
      fetch(
        `https://0vum1ao9sc.execute-api.eu-central-1.amazonaws.com/prod/report/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((data) => data.json())
        .then(setReport);
    }
  }, [reportId]);

  // const onDownload = useCallback(() => {
  //   const data = JSON.stringify(report);
  //   download(data, "report.json");
  // }, [report]);

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
      header={{ height: 60 }}
      navbar={{ width: 40, breakpoint: "xs" }}
    >
      <AppShell.Navbar>
        <Stack>{actions}</Stack>
      </AppShell.Navbar>
      <AppShell.Header>
        <Flex justify="space-between" align="center">
          <Logo
            onClick={() => navigate("/reports")}
            type="horizontal"
            style={{ width: "171.6px", height: "38.62px" }}
          />
          {userInfo?.name || "Noname"}
          {/* <Button ml="auto" onClick={onDownload}>
            Download
          </Button> */}
        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        <Container ref={ref} fluid style={{ height: "100%" }} px={0}>
          {report && (
            <ReportTable mode={mode} report={report} height={rect.height} />
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
