import { Button, FileButton } from "@mantine/core";

export type ReadyReportLoaderProps = {
  reportLoaded: (file: File) => void;
};

export const ReadyReportLoader = ({ reportLoaded }: ReadyReportLoaderProps) => {
  return (
    <FileButton onChange={reportLoaded!} accept="application/json">
      {(props) => <Button {...props}>Upload Ready Report</Button>}
    </FileButton>
  );
};
