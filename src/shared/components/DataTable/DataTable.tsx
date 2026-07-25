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
  Button,
} from "@mui/material";
import { Search, Filter, Download, Upload, RefreshCw } from "lucide-react";
import { DropdownMenu } from "@/shared/components";
import type { Order } from "@/shared/types";

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  format?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface Action<T> {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
  color?: "primary" | "secondary" | "error" | "inherit";
  disabled?: boolean;
}

export interface HeaderAction {
  id: string;
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "error" | "inherit";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: keyof T;
  actions?: Action<T>[];
  headerActions?: HeaderAction[];
  filterOptions?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  showFilterButton?: boolean;
  showSearchInput?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showExportButton?: boolean;
  showImportButton?: boolean;
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

const DEFAULT_HEADER_ACTIONS: HeaderAction[] = [
  {
    id: "refresh",
    icon: <RefreshCw size={18} />,
    label: "Làm mới",
    onClick: () => {},
    variant: "outlined",
  },
];

export function DataTable<T extends object>({
  columns,
  rows,
  rowKey,
  actions,
  headerActions = DEFAULT_HEADER_ACTIONS,
  filterOptions = [],
  filterValue,
  onFilterChange,
  showFilterButton = false,
  showSearchInput = true,
  searchValue = "",
  onSearchChange,
  showExportButton = true,
  showImportButton = true,
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
  const [filterOpen, setFilterOpen] = useState(false);

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

  const handleFilterSelect = (value: string) => {
    onFilterChange?.(value);
    setFilterOpen(false);
  };

  const filterMenuItems = filterOptions.map((option) => ({
    id: option.value,
    label: option.label,
    icon: option.icon,
    onClick: () => handleFilterSelect(option.value),
  }));

  const isSelectable = false;
  const count = totalCount ?? rows.length;

  const getButtonSx = (
    variant: "text" | "outlined" | "contained" | undefined,
  ) => {
    if (variant === "contained") {
      return {
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "1px solid #2563eb",
        borderRadius: "6px",
        px: 2,
        py: 0.75,
        fontSize: "0.8125rem",
        fontWeight: 600,
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#1d4ed8",
          borderColor: "#1d4ed8",
          boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.2)",
        },
      };
    }
    return {
      color: "#2563eb",
      border: "1px solid #2563eb",
      borderRadius: "6px",
      px: 2,
      py: 0.75,
      fontSize: "0.8125rem",
      fontWeight: 600,
      textTransform: "none",
      "&:hover": {
        backgroundColor: "rgba(37, 99, 235, 0.08)",
        boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.15)",
      },
    };
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {showSearchInput && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Search size={18} color="#2563eb" />
              <Box
                component="input"
                type="text"
                placeholder="Tìm kiếm..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                spellCheck={false}
                sx={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.875rem",
                  color: "#2563eb",
                  fontWeight: 500,
                  width: 180,
                  "&::placeholder": {
                    color: "#2563eb",
                    opacity: 0.7,
                  },
                }}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {showFilterButton && filterOptions.length > 0 ? (
            <DropdownMenu
              trigger={
                <Button
                  size="small"
                  startIcon={<Filter size={16} />}
                  sx={getButtonSx("outlined")}
                >
                  Filter
                </Button>
              }
              items={filterMenuItems}
              controlledOpen={filterOpen}
              onOpenChange={setFilterOpen}
            />
          ) : (
            filterOptions.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="caption"
                  sx={{ color: "#64748b", fontWeight: 500, mr: 1 }}
                >
                  Trạng thái:
                </Typography>
                <Box sx={{ display: "flex" }}>
                  {filterOptions.map((option, index) => (
                    <Box
                      key={option.value}
                      onClick={() => onFilterChange?.(option.value)}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.75rem",
                        fontWeight: filterValue === option.value ? 600 : 400,
                        color:
                          filterValue === option.value ? "#fff" : "#2563eb",
                        backgroundColor:
                          filterValue === option.value
                            ? "#2563eb"
                            : "transparent",
                        border: "1px solid #2563eb",
                        cursor: "pointer",
                        borderRadius:
                          index === 0
                            ? "6px 0 0 6px"
                            : index === filterOptions.length - 1
                              ? "0 6px 6px 0"
                              : "0",
                        ml: index > 0 ? "-1px" : 0,
                        "&:hover": {
                          backgroundColor:
                            filterValue === option.value
                              ? "#1d4ed8"
                              : "rgba(37, 99, 235, 0.08)",
                        },
                      }}
                    >
                      {option.label}
                    </Box>
                  ))}
                </Box>
              </Box>
            )
          )}

          {showExportButton && (
            <Button
              size="small"
              startIcon={<Download size={16} />}
              sx={getButtonSx("outlined")}
            >
              Export
            </Button>
          )}
          {showImportButton && (
            <Button
              size="small"
              startIcon={<Upload size={16} />}
              sx={getButtonSx("outlined")}
            >
              Import
            </Button>
          )}
          {headerActions.map((action) => (
            <Button
              key={action.id}
              size="small"
              startIcon={action.icon}
              onClick={action.onClick}
              sx={getButtonSx(action.variant)}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </Box>

      <TableContainer
        sx={{
          maxHeight: 640,
          "& .MuiTableCell-stickyHeader": {
            backgroundColor: "#1470e0 !important",
            color: "#ffffff !important",
            "& *": {
              color: "#ffffff !important",
            },
          },
        }}
      >
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
                              disabled={action.disabled}
                              sx={{
                                "& svg": {
                                  fill: "none",
                                  stroke: "currentColor",
                                  strokeWidth: 2,
                                },
                              }}
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
