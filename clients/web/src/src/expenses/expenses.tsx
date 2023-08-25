import "./expenses.css";
import "react-data-grid/lib/styles.css";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import DataGrid from "react-data-grid";
import { createPortal } from "react-dom";
import {
  AppShell,
  Button,
  Container,
  Flex,
  Header,
  Modal,
  Navbar,
  Table,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { apiPaths, usePost } from "../shared";

export type ExpensesProps = {
  info: {
    headers: string[];
    data: string[][];
  };
};

export const Expenses = ({ info }: ExpensesProps) => {
  const { post, data } = usePost(apiPaths.map + "/map");

  const [address, setAddress] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  const [columns, rows] = useMemo(() => {
    const columns = info.headers.map((item) => ({
      key: item,
      name: item,
      width: item === "Counterparty" ? 450 : undefined,
    }));

    const rows = info.data.map((row) => {
      return info.headers.reduce((result, next, idx) => {
        return {
          ...result,
          [next]: row[idx],
        };
      }, {} as Record<string, string>);
    });

    return [columns, rows];
  }, [info]);

  const [contextMenuProps, setContextMenuProps] = useState<{
    rowIdx: number;
    top: number;
    left: number;
  } | null>(null);

  const [opened, { open, close }] = useDisclosure(false);

  const menuRef = useRef<HTMLMenuElement | null>(null);

  const isContextMenuOpen = contextMenuProps !== null;

  console.log(data);

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

  const onDownload = () => {
    const data = JSON.stringify(info);
    const base64 = btoa(data);

    const linkSource = `data:application/json;base64,${base64}`;
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = "_self";
    downloadLink.download = "report.json";
    downloadLink.click();
  };

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 40 }} height={500} p="xs">
          {/* Navbar content */}
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Flex justify="flex-end" align="center">
            <Button ml="auto" onClick={onDownload}>
              Download
            </Button>
          </Flex>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: "white",
        },
      })}
    >
      <Table striped withBorder highlightOnHover>
        <thead>
          <tr>
            {columns.map(({ key, name, width }) => {
              return <th key={key}>{name}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => {
                  return (
                    <td key={`${rowIndex}_${columnIndex}`}>
                      {row[column.key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
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
              <button type="button" onClick={open}>
                Set type
              </button>
            </li>
          </menu>,
          document.body
        )}

      <Modal
        opened={opened}
        onClose={close}
        title="Authentication"
        style={{ left: 0 }}
      >
        <TextInput
          label="Address"
          data-autofocus
          placeholder="Enter address"
          onChange={(el) => setAddress(el.target.value)}
        />
        <TextInput
          label="Type"
          placeholder="Enter type of the expense"
          mt="md"
          onChange={(el) => setType(el.target.value)}
        />
        <Button
          onClick={() => {
            post(JSON.stringify([{ address, type }]));
          }}
        >
          Insert
        </Button>
      </Modal>
    </AppShell>
  );
};
