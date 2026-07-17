// ============================================================
// Student Table Component
// ============================================================
"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Badge } from "@/shared/components";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { Plus, RefreshCw } from "lucide-react";
import { DataTable } from "@/shared/components";
import type { Student } from "../types";

interface StudentTableProps {
  students: Student[];
  loading?: boolean;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
  onView?: (student: Student) => void;
  filterOptions?: { value: string; label: string; icon?: React.ReactNode }[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  onAdd?: () => void;
  onRefresh?: () => void;
}

const getStatusColor = (status: Student["trangThai"]) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "default";
    case "graduated":
      return "info";
    default:
      return "default";
  }
};

const getStatusLabel = (status: Student["trangThai"]) => {
  switch (status) {
    case "active":
      return "Đang học";
    case "inactive":
      return "Nghỉ học";
    case "graduated":
      return "Đã tốt nghiệp";
    default:
      return status;
  }
};

export function StudentTable({
  students,
  loading = false,
  onEdit,
  onDelete,
  onView,
  filterOptions = [],
  filterValue,
  onFilterChange,
  onAdd,
  onRefresh,
}: StudentTableProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const textColor = isDarkMode ? "#cbd5e1" : "#0F172A";
  const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";

  const columns = [
    {
      id: "mssv",
      label: "MSSV",
      minWidth: 100,
    },
    {
      id: "hoTen",
      label: "Họ tên",
      minWidth: 180,
      format: (_: unknown, student: Student) => (
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: textColor }}
          >
            {student.hoTen}
          </Typography>
          <Typography variant="caption" sx={{ color: secondaryTextColor }}>
            {student.gmail}
          </Typography>
        </Box>
      ),
    },
    {
      id: "khoa",
      label: "Khoa",
      minWidth: 120,
    },
    {
      id: "khoaHoc",
      label: "Khóa",
      minWidth: 80,
    },
    {
      id: "lop",
      label: "Lớp",
      minWidth: 80,
    },
    {
      id: "deTai",
      label: "Đề tài",
      minWidth: 150,
      format: (_: unknown, student: Student) =>
        student.deTai ? (
          <Badge
            label={
              student.deTai.length > 30
                ? student.deTai.substring(0, 30) + "..."
                : student.deTai
            }
            variant="outlined"
            color="primary"
          />
        ) : (
          <Typography variant="caption" sx={{ color: secondaryTextColor }}>
            Chưa có đề tài
          </Typography>
        ),
    },
    {
      id: "trangThai",
      label: "Trạng thái",
      minWidth: 100,
      format: (_: unknown, student: Student) => (
        <Badge
          label={getStatusLabel(student.trangThai)}
          variant="soft"
          color={getStatusColor(student.trangThai)}
        />
      ),
    },
  ];

  const actions = [
    {
      id: "view",
      icon: <ViewIcon fontSize="small" />,
      label: "Xem chi tiết",
      onClick: (student: Student) => onView?.(student),
      color: "inherit" as const,
    },
    {
      id: "edit",
      icon: <EditIcon fontSize="small" />,
      label: "Sửa",
      onClick: (student: Student) => onEdit?.(student),
      color: "primary" as const,
    },
    {
      id: "delete",
      icon: <DeleteIcon fontSize="small" />,
      label: "Xóa",
      onClick: (student: Student) => onDelete?.(student),
      color: "error" as const,
    },
  ];

  const headerActions = [
    ...(onAdd
      ? [
          {
            id: "add",
            icon: <Plus size={16} />,
            label: "Thêm sinh viên",
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
      rows={students}
      rowKey="mssv"
      actions={actions}
      headerActions={headerActions}
      filterOptions={filterOptions}
      filterValue={filterValue}
      onFilterChange={onFilterChange}
      showFilterButton={true}
      loading={loading}
      emptyMessage="Không có sinh viên nào"
    />
  );
}
