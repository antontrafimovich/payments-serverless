import { AppShell } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { request } from "../../shared/lib/utils/http";

type Report = {
  name: string;
  id: string;
};

const getReportsList = (): Promise<Report[]> => {
  return request(
    "https://0vum1ao9sc.execute-api.eu-central-1.amazonaws.com/prod/report",
    {}
  ).then((data) => data.json());
};

export const ReportSelector = () => {
  const navigate = useNavigate();

  const { data, isPending, error } = useQuery({
    queryKey: ["reports"],
    queryFn: getReportsList,
  });

  console.log(data);
  console.log(error);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>Reports Selector</AppShell.Header>
      <AppShell.Main>
        {isPending && "Loading..."}
        {data?.map((item) => (
          <div key={item.id} onClick={() => navigate(`/payments/${item.id}`)}>
            {item.name}
          </div>
        ))}
      </AppShell.Main>
    </AppShell>
  );
};
