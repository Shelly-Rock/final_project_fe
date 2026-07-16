"use client";

import {
  Table as MuiTable,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
} from "@mui/material";
import { useTheme } from "@/shared/theme";
import { clsx } from "clsx";

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: number | string;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  variant?: "striped" | "bordered" | "clean";
  emptyText?: string;
  onRowClick?: (row: T, index: number) => void;
  selectedRowIndex?: number;
  stickyHeader?: boolean;
  size?: "small" | "medium";
}

export function Table<T extends object>({
  columns,
  data,
  variant = "clean",
  emptyText = "Không có dữ liệu",
  onRowClick,
  selectedRowIndex,
  stickyHeader = false,
  size = "medium",
}: TableProps<T>) {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";

  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(row, data.indexOf(row));
    }
    const value = (row as Record<string, unknown>)[column.key as string];
    return value !== undefined && value !== null ? String(value) : "";
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        maxHeight: stickyHeader ? 400 : undefined,
        border: "1px solid",
        borderColor: isDark ? "#334155" : "#e2e8f0",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <MuiTable size={size} stickyHeader={stickyHeader}>
        <TableHead>
          <TableRow
            sx={{
              bgcolor: isDark ? "#1e293b" : "#f8fafc",
              "& th": {
                borderBottom: "2px solid",
                borderColor: isDark ? "#334155" : "#e2e8f0",
              },
            }}
          >
            {columns.map((column) => (
              <TableCell
                key={String(column.key)}
                align={column.align || "left"}
                sx={{
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  color: isDark ? "#f1f5f9" : "#0f172a",
                  bgcolor: "inherit",
                }}
                width={column.width}
              >
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{
                  py: 4,
                  color: isDark ? "#64748b" : "#94a3b8",
                  bgcolor: isDark ? "#0f172a" : "#ffffff",
                }}
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => onRowClick?.(row, index)}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  bgcolor:
                    selectedRowIndex === index
                      ? isDark
                        ? "#1e3a5f"
                        : "#dbeafe"
                      : variant === "striped" && index % 2 === 1
                        ? isDark
                          ? "#1e293b"
                          : "#f8fafc"
                        : "transparent",
                  "&:hover": {
                    bgcolor:
                      selectedRowIndex === index
                        ? isDark
                          ? "#1e3a5f"
                          : "#dbeafe"
                        : isDark
                          ? "#334155"
                          : "#f1f5f9",
                  },
                  "& td": {
                    borderBottom: "1px solid",
                    borderColor: isDark ? "#334155" : "#e2e8f0",
                  },
                  ...(variant === "bordered" && {
                    "& td, & th": {
                      border: "1px solid",
                      borderColor: isDark ? "#334155" : "#e2e8f0",
                    },
                  }),
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    align={column.align || "left"}
                    sx={{
                      color: isDark ? "#cbd5e1" : "#334155",
                    }}
                  >
                    {getCellValue(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
