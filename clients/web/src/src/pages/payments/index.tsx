import {
  AppShell,
  Container,
  Flex,
  Stack,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { ComponentProps, FC, useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AppContext } from "../../app";
import {
  Logo,
  PivotTableIcon,
  Report,
  TableIcon,
  withHover,
} from "../../shared";
import { request } from "../../shared/lib/utils/http";
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

const getReport = ({ queryKey }: QueryFunctionContext): Promise<Report> => {
  const [_, id] = queryKey;

  return request(
    `https://0vum1ao9sc.execute-api.eu-central-1.amazonaws.com/prod/report/${id}`,
    {}
  ).then((data) => data!.json());
};

export const Payments = () => {
  const [ref, rect] = useResizeObserver();
  const { reportId } = useParams();
  const [mode, setMode] = useState<"plain" | "pivot">("plain");
  const navigate = useNavigate();

  const { userInfo } = useContext(AppContext);

  const { data: report } = useQuery({
    queryKey: ["reports", reportId],
    queryFn: getReport,
  });

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
