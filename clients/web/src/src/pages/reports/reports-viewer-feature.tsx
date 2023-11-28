import { AppShell, Group, Tabs } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { request } from "../../shared/lib/utils/http";
import { RemoteData } from "../../shared/ui/remote-data/remote-data";
import { ReportsViewer } from "./ui/reports-viewer";

type Report = {
  name: string;
  id: string;
};

const ReportSelectorError = ({ error }: { error: Error | null }) => {
  return <>{error && error.message}</>;
};

const ReportSelectorSuccess = ({ data }: { data: Report[] }) => {
  const navigate = useNavigate();
  const { reportId } = useParams();

  return (
    <Tabs value={reportId} orientation="vertical">
      <Tabs.List>
        {data?.map((item) => (
          <Tabs.Tab
            value={item.id}
            onClick={() => navigate(`/reports/${item.id}`)}
          >
            {item.name}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );

  return <>{}</>;
};

const ReportsSelector = () => {
  const queryData = useQuery({
    queryKey: ["reports"],
    queryFn: getReportsList,
  });

  return (
    <RemoteData
      data={queryData}
      success={ReportSelectorSuccess}
      error={ReportSelectorError}
    />
  );
};

const getReportsList = async (): Promise<Report[]> => {
  const response = await request(
    "https://0vum1ao9sc.execute-api.eu-central-1.amazonaws.com/prod/report",
    {}
  );

  if (response?.ok) {
    return response.json();
  }

  const error = await response?.text();
  throw new Error(error);
};

export const ReportsViewerFeature = () => {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>Reports Selector</AppShell.Header>
      <AppShell.Main>
        <Group align="flex-start">
          <ReportsSelector />
          <ReportsViewer />
        </Group>
      </AppShell.Main>
    </AppShell>
  );
};
