import { AppShell } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { request } from "../../shared/lib/utils/http";

type Report = {
  name: string;
  id: string;
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
        {error && error.message}
        {data &&
          !error &&
          data?.map((item) => (
            <div key={item.id} onClick={() => navigate(`/payments/${item.id}`)}>
              {item.name}
            </div>
          ))}
      </AppShell.Main>
    </AppShell>
  );
};
