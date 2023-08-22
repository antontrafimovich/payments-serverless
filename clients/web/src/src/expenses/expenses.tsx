import "./expenses.css";
import "react-data-grid/lib/styles.css";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import DataGrid from "react-data-grid";
import { createPortal } from "react-dom";

export type ExpensesProps = {
  data: {
    headers: string[];
    data: string[][];
  };
};

export const Expenses = ({ data }: ExpensesProps) => {
  const [columns, rows] = useMemo(() => {
    const columns = data.headers.map((item) => ({
      key: item,
      name: item,
      width: item === "Counterparty" ? 450 : undefined,
    }));

    const rows = data.data.map((row) => {
      return data.headers.reduce((result, next, idx) => {
        return {
          ...result,
          [next]: row[idx],
        };
      }, {});
    });

    return [columns, rows];
  }, [data]);

  const [contextMenuProps, setContextMenuProps] = useState<{
    rowIdx: number;
    top: number;
    left: number;
  } | null>(null);

  const menuRef = useRef<HTMLMenuElement | null>(null);

  const isContextMenuOpen = contextMenuProps !== null;

  useLayoutEffect(() => {
    if (!isContextMenuOpen) return;

    function onClick(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      setContextMenuProps(null);
    }

    addEventListener("click", onClick);

    return () => {
      removeEventListener("click", onClick);
    };
  }, [isContextMenuOpen]);

  return (
    <div className="expenses">
      <DataGrid
        columns={columns}
        rows={rows}
        onCellContextMenu={({ row }, event) => {
          event.preventGridDefault();
          // Do not show the default context menu
          event.preventDefault();
          setContextMenuProps({
            rowIdx: rows.indexOf(row),
            top: event.clientY,
            left: event.clientX,
          });
        }}
      />
      {isContextMenuOpen &&
        createPortal(
          <menu
            ref={menuRef}
            className="expenses-context-menu"
            style={
              {
                top: contextMenuProps.top,
                left: contextMenuProps.left,
              } as unknown as React.CSSProperties
            }
          >
            <li>
              <button
                type="button"
                onClick={() => {
                  const { rowIdx } = contextMenuProps;

                  setContextMenuProps(null);
                }}
              >
                Delete Row
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  const { rowIdx } = contextMenuProps;
                  setContextMenuProps(null);
                }}
              >
                Insert Row Above
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  const { rowIdx } = contextMenuProps;
                  setContextMenuProps(null);
                }}
              >
                Insert Row Below
              </button>
            </li>
          </menu>,
          document.body
        )}
    </div>
  );
};
