import { AppShell } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";

export const ReportSelector = () => {
  const [token] = useLocalStorage({ key: "token" });

  const [reportsData, setReportsData] =
    useState<{ name: string; id: string }[]>();

  useEffect(() => {
    token &&
      fetch(
        "https://0vum1ao9sc.execute-api.eu-central-1.amazonaws.com/prod/report",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((data) => data.json())
        .then(setReportsData);
  }, [token]);

  console.log(reportsData);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>Reports Selector</AppShell.Header>
      <AppShell.Main>
        {reportsData?.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </AppShell.Main>
    </AppShell>
  );
};
