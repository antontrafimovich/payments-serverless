import { BeatLoader } from "react-spinners";

export type RemoteDataProps<T> = {
  data: {
    isPending: boolean;
    error: Error | null;
    data: T | undefined;
  };
  success: (props: { data: T }) => JSX.Element;
  error: (props: { error: Error | null }) => JSX.Element;
};

export const RemoteData = <T,>(props: RemoteDataProps<T>) => {
  if (props.data.isPending) {
    return <BeatLoader />;
  }

  if (props.data.data) {
    return <props.success data={props.data.data} />;
  }

  return <props.error error={props.data.error} />;
};
