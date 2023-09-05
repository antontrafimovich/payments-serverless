/// <reference types="vite-plugin-svgr/client" />
import { Flex } from "@mantine/core";
import { ComponentProps, FC } from "react";
import { styled } from "styled-components";

import { ReactComponent as SVGLogoHorizontalIcon } from "./logo-horizontal.svg";
import { ReactComponent as SVGLogoVerticalIcon } from "./logo-vertical.svg";
import { ReactComponent as SVGPivotTableIcon } from "./pivot-table.svg";
import { ReactComponent as SVGTableIcon } from "./table.svg";
import { ReactComponent as SVGTogglerIcon } from "./toggler.svg";

export const withHover = (icon: FC<ComponentProps<"svg">>, color: string) => {
  return styled(icon)`
    &:hover {
      path:not([stroke="none"])[stroke],
      rect:not([stroke="none"])[stroke] {
        stroke: ${color};
      }
    }
  `;
};

export const toIcon = (Icon: FC<ComponentProps<"svg">>, size: number) => {
  return (props: ComponentProps<"svg">) => {
    return (
      <Flex align="center" justify="center" w={size} h={size}>
        <Icon {...props} />
      </Flex>
    );
  };
};

export const toAction = (icon: FC<ComponentProps<"svg">>) => {
  return styled(icon)`
    cursor: pointer;
  `;
};



export const TableIcon = SVGTableIcon;
export const PivotTableIcon = SVGPivotTableIcon;
export const TogglerIcon = toIcon(SVGTogglerIcon, 24);
export const LogoVerticalIcon = toAction(SVGLogoVerticalIcon);
export const LogoHorizontalIcon = toAction(SVGLogoHorizontalIcon);
