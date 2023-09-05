import { ComponentProps } from "react";

import { LogoHorizontalIcon, LogoVerticalIcon } from "../icons";

export interface LogoProps extends Omit<ComponentProps<"svg">, "ref"> {
  type?: "vertical" | "horizontal";
}

export const Logo = ({ type, ...rest }: LogoProps) => {
  if (!type || type === "vertical") {
    return <LogoVerticalIcon {...rest} />;
  }

  return <LogoHorizontalIcon {...rest} />;
};
