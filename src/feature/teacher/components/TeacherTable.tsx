"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Badge } from "@/shared/components";
import { Edit as EditIcon, Block } from "@mui/icons-material";
import { Plus, RefreshCw, Download, Upload } from "lucide-react";
import { DataTable } from "@/shared/components";
import type {
  Column,
  Action,
  HeaderAction,
  FilterOption,
} from "@/shared/components";
import type { Teacher } from "../types";

interface TeacherTableProps {
  teachers: Teacher[];
  loading?: boolean;
  filterDepartment?: string;
  onFilterDepartmentChange?: (value: string) => void;
  departments?: string[];
  onEdit: (teacher: Teacher) => void;
  onToggleStatus: (
    teacherId: number,
    currentStatus: "active" | "inactive",
  ) => void;
  onRefresh?: () => void;
  onAdd?: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

const statusConfig = {
  active: { label: "Đang công tác", color: "success" as const },
  inactive: { label: "Tạm khóa", color: "default" as const },
};

export function TeacherTable({
  teachers,
  loading = false,
  filterDepartment = "all",
  onFilterDepartmentChange,
  departments = [],
  onEdit,
  onToggleStatus,
  onRefresh,
  onAdd,
  onImport,
  onExport,
}: TeacherTableProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const textColor = isDarkMode ? "#cbd5e1" : "#0F172A";
  const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";

  // Build filter options from departments
  const filterOptions: FilterOption[] = [
    { value: "all", label: "Tất cả chuyên ngành" },
    ...departments.map((dept) => ({ value: dept, label: dept })),
  ];

  const columns: Column<Teacher>[] = [
    {
      id: "code",
      label: "Mã GV",
      minWidth: 90,
      format: (_, row) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          {row.code}
        </Typography>
      ),
    },
    {
      id: "fullName",
      label: "Họ và tên",
      minWidth: 180,
      format: (_, row) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: textColor }}>
          {row.fullName}
        </Typography>
      ),
    },
    {
      id: "email",
      label: "Email",
      minWidth: 200,
      format: (_, row) => (
        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
          {row.email || "—"}
        </Typography>
      ),
    },
    {
      id: "phone",
      label: "Số điện thoại",
      minWidth: 120,
      format: (_, row) => (
        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
          {row.phone || "—"}
        </Typography>
      ),
    },
    {
      id: "department",
      label: "Chuyên ngành",
      minWidth: 180,
      format: (_, row) => (
        <Typography variant="body2" sx={{ color: textColor }}>
          {row.department}
        </Typography>
      ),
    },
    {
      id: "position",
      label: "Chức vụ",
      minWidth: 140,
      format: (_, row) => (
        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
          {row.position || "—"}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 120,
      align: "center",
      sortable: false,
      format: (val) => {
        const config = statusConfig[val as keyof typeof statusConfig];
        return (
          <Badge label={config.label} color={config.color} variant="soft" />
        );
      },
    },
  ];

  const actions: Action<Teacher>[] = [
    {
      id: "edit",
      icon: <EditIcon fontSize="small" />,
      label: "Sửa",
      color: "primary" as const,
      onClick: (row) => onEdit(row),
    },
    {
      id: "toggleStatus",
      icon: <Block fontSize="small" />,
      label: "Khóa/Mở",
      color: "inherit" as const,
      onClick: (row) => onToggleStatus(row.id, row.status),
    },
  ];

  const headerActions: HeaderAction[] = [
    ...(onExport
      ? [
          {
            id: "export",
            icon: <Download size={16} />,
            label: "Export Excel",
            onClick: onExport,
            variant: "outlined" as const,
          },
        ]
      : []),
    ...(onImport
      ? [
          {
            id: "import",
            icon: <Upload size={16} />,
            label: "Import Excel",
            onClick: onImport,
            variant: "outlined" as const,
          },
        ]
      : []),
    ...(onAdd
      ? [
          {
            id: "add",
            icon: <Plus size={16} />,
            label: "Thêm giảng viên",
            onClick: onAdd,
            variant: "contained" as const,
          },
        ]
      : []),
    ...(onRefresh
      ? [
          {
            id: "refresh",
            icon: <RefreshCw size={16} />,
            label: "Làm mới",
            onClick: onRefresh,
            variant: "outlined" as const,
          },
        ]
      : []),
  ];

  return (
    <DataTable
      columns={columns}
      rows={teachers}
      rowKey="id"
      actions={actions}
      headerActions={headerActions}
      filterOptions={filterOptions}
      filterValue={filterDepartment}
      onFilterChange={onFilterDepartmentChange}
      showFilterButton={true}
      showExportButton={false}
      showImportButton={false}
      loading={loading}
      emptyMessage="Chưa có giảng viên nào"
    />
  );
}
