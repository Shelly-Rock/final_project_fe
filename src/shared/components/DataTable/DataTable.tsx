"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Box,
  Typography,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import type { Order } from "@/shared/types";

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  format?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface Action<T> {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
  color?: "primary" | "secondary" | "error" | "inherit";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: keyof T;
  actions?: Action<T>[];
  loading?: boolean;
  emptyMessage?: string;
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

function SkeletonRows<T>({
  columns,
  rows = 5,
}: {
  columns: Column<T>[];
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <TableRow key={idx}>
          {columns.map((col) => (
            <TableCell key={String(col.id)}>
              <Skeleton variant="text" width="80%" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function DataTable<T extends object>({
  columns,
  rows,
  rowKey,
  actions,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  totalCount,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}: DataTableProps<T>) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string | null>(null);

  const handleSort = (colId: string) => {
    const isAsc = orderBy === colId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(colId);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  const isSelectable = false;
  const count = totalCount ?? rows.length;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  align={col.align ?? "left"}
                  style={{ minWidth: col.minWidth }}
                  sortDirection={orderBy === col.id ? order : false}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(String(col.id))}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {actions && actions.length > 0 && (
                <TableCell
                  align="center"
                  sx={{ minWidth: actions.length * 56 }}
                >
                  Thao tác
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <SkeletonRows columns={columns} />
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={String(row[rowKey])}
                  hover
                  selected={isSelectable}
                  sx={{ cursor: isSelectable ? "pointer" : "default" }}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.id)} align={col.align ?? "left"}>
                      {col.format
                        ? col.format(row[col.id as keyof T] as T[keyof T], row)
                        : (row[col.id as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {actions && actions.length > 0 && (
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        {actions.map((action) => (
                          <Tooltip key={action.id} title={action.label} arrow>
                            <IconButton
                              size="small"
                              onClick={() => action.onClick(row)}
                              color={action.color ?? "default"}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {(onPageChange || onRowsPerPageChange) && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      )}
    </Paper>
  );
}
