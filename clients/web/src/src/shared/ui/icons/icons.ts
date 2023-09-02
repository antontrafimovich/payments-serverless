/// <reference types="vite-plugin-svgr/client" />

import { ReactComponent as SVGTableIcon } from "./table.svg";
import { ReactComponent as SVGPivotTableIcon } from "./pivot-table.svg";
import { ComponentProps, FC } from "react";
import { styled } from "styled-components";

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

export const TableIcon = SVGTableIcon;
export const PivotTableIcon = SVGPivotTableIcon;
