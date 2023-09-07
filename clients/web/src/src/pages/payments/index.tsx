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
import { useResizeObserver } from "@mantine/hooks";
import {
  ComponentProps,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { AppContext } from "../../app";
import {
  download,
  Logo,
  PivotTableIcon,
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
  { icon: withHover(TableIcon, "red"), label: "Plain" },
  { icon: withHover(PivotTableIcon, "red"), label: "Pivot" },
];

export const Payments = ({ report }: ExpensesProps) => {
  const [ref, rect] = useResizeObserver();

  const { setReport } = useContext(AppContext);

  const [mode, setMode] = useState<"plain" | "pivot">("plain");

  const onDownload = useCallback(() => {
    const data = JSON.stringify(report);
    download(data, "report.json");
  }, [report]);

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
