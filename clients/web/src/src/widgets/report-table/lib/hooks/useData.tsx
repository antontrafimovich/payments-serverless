import { Flex, Text } from "@mantine/core";
import { DataTableColumn } from "mantine-datatable";
import { useMemo } from "react";

import { generateUid, Report, toAction, TogglerIcon } from "../../../../shared";
import { Row } from "../../model";

const ToggerIconAction = toAction(TogglerIcon);

export type UseDataProps = {
  report: Report;
  columns: string[];
  rows: string[];
  values: string[];
};

const groupBy = (
  records: string[][],
  index: number
): Record<string, string[][]> => {
  const result: Record<string, string[][]> = {};

  for (let i = 0; i < records.length; i++) {
    const value = records[i][index];

    if (result[value]) {
      result[value].push(records[i]);
    } else {
      result[value] = [records[i]];
    }
  }

  return result;
};

const getSumOfValuesByPropIndex = (
  values: string[][],
  propColumnIndex: number,
  propValue: string
) => {
  return values.reduce((result, row) => {
    if ((row[propColumnIndex] ?? "Empty") === propValue) {
      return result + parseFloat(row[1]);
    }

    return result;
  }, 0);
};

export const useData = ({
  report,
  columns,
  rows,
  values,
}: UseDataProps): [DataTableColumn<Row>[], Row[]] => {
  // rows = ['Date', 'Id'], columns = ['Counterparty'], values = ['Value']

  return useMemo(() => {
    if (!columns && !rows) {
      const columns = report.headers.map<DataTableColumn<Row>>((item) => {
        return {
          accessor: item,
        };
      });

      const rows = report.data.map((row) => {
        return report.headers.reduce(
          (result, next, idx) => {
            return {
              ...result,
              id: generateUid(),
              [next]: row[idx],
            };
          },
          { id: generateUid() } as Row
        );
      });

      return [columns, rows];
    }

    const [columnValue] = columns;

    const columnValueIndex = report.headers.findIndex(
      (header) => header === columnValue
    );

    const hierarhcyColumn: DataTableColumn<Row> = {
      accessor: "hierarchyValue",
      cellsStyle: ({ isLeaf }) => {
        return {
          paddingLeft: isLeaf ? "24px" : "8px",
          background: !isLeaf ? "red" : undefined,
          opacity: !isLeaf ? 0.75 : undefined,
        };
      },

      render: (record: Row) => {
        return (
          <Flex
            align="center"
            justify="flex-start"
            // sx={{ "& > * + *": { marginLeft: "4px" } }}
            pl={record.level * 16}
          >
            {!record.isLeaf && <ToggerIconAction />}
            <Text fw={record.isLeaf ? "normal" : "bold"} inline>
              {record["hierarchyValue"]}
            </Text>
          </Flex>
        );
      },
    };

    const uniqueColumnValues = Array.from(
      new Set(report.data.map((item) => item[columnValueIndex]))
    );

    const resultColumns: DataTableColumn<Row>[] = [
      hierarhcyColumn,
      ...uniqueColumnValues.map((value) => {
        return {
          accessor: value ?? "Empty",
        };
      }),
    ];

    // rows formation
    const [groupingValue] = rows;

    const groupingValueIndex = report.headers.findIndex(
      (header) => header === groupingValue
    );

    const groupedRows = groupBy(report.data, groupingValueIndex);

    const idFieldIndex = report.headers.findIndex((header) => header === "Id");

    const resultData = Object.keys(groupedRows).reduce<Row[]>(
      (result, next) => {
        const subtotalRow: Row = uniqueColumnValues.reduce(
          (row, column) => {
            return {
              ...row,
              [column ?? "Empty"]: getSumOfValuesByPropIndex(
                groupedRows[next],
                columnValueIndex,
                column
              ),
            };
          },
          {
            hierarchyValue: next,
            id: generateUid(),
            level: 0,
            isLeaf: false,
          }
        );

        const hierarchyRows: Row[] = groupedRows[next].map((row) => {
          return {
            hierarchyValue: row[idFieldIndex],
            id: generateUid(),
            level: 1,
            isLeaf: true,
            ...uniqueColumnValues.reduce((map, column) => {
              return {
                ...map,
                [column ?? "Empty"]:
                  row[columnValueIndex] === column ? row[1] : null,
              };
            }, {}),
          };
        });

        return [...result, subtotalRow, ...hierarchyRows];
      },
      []
    );

    return [resultColumns, resultData];
  }, [report, columns, rows]);
};
