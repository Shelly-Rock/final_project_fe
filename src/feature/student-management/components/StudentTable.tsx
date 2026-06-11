"use client";

import { Box, Chip, Tooltip, Typography } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { DataTable, Column, Action } from "@/shared/components";
import type { Student } from "../types";

interface StudentTableProps {
  students: Student[];
  loading?: boolean;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onView: (student: Student) => void;
}

export function StudentTable({
  students,
  loading = false,
  onEdit,
  onDelete,
  onView,
}: StudentTableProps) {
  const columns: Column<Student>[] = [
    {
      id: "stt",
      label: "STT",
      minWidth: 60,
      align: "center",
      sortable: true,
    },
    {
      id: "mssv",
      label: "MSSV",
      minWidth: 100,
      sortable: true,
    },
    {
      id: "hoTen",
      label: "Họ và tên",
      minWidth: 180,
      sortable: true,
    },
    {
      id: "khoa",
      label: "Khoa",
      minWidth: 160,
      sortable: true,
    },
    {
      id: "khoaHoc",
      label: "Khóa",
      minWidth: 80,
      align: "center",
      sortable: true,
    },
    {
      id: "gmail",
      label: "Gmail",
      minWidth: 200,
    },
    {
      id: "deTai",
      label: "Đề tài",
      minWidth: 200,
      format: (value) => {
        if (!value) {
          return (
            <Chip
              label="Chưa chọn"
              size="small"
              sx={{
                bgcolor: "warning.light",
                color: "warning.dark",
                fontWeight: 500,
              }}
            />
          );
        }
        return (
          <Tooltip title={String(value)} arrow>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 200,
              }}
            >
              {String(value)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: "giaoVienHuongDan",
      label: "GVHD",
      minWidth: 150,
      format: (value) => {
        if (!value) {
          return (
            <Chip
              label="—"
              size="small"
              sx={{
                bgcolor: "grey.200",
                color: "grey.600",
              }}
            />
          );
        }
        return String(value);
      },
    },
  ];

  const actions: Action<Student>[] = [
    {
      id: "view",
      icon: <ViewIcon fontSize="small" />,
      label: "Xem chi tiết",
      onClick: onView,
      color: "primary",
    },
    {
      id: "edit",
      icon: <EditIcon fontSize="small" />,
      label: "Sửa",
      onClick: onEdit,
      color: "primary",
    },
    {
      id: "delete",
      icon: <DeleteIcon fontSize="small" />,
      label: "Xóa",
      onClick: onDelete,
      color: "error",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataTable
        columns={columns}
        rows={students}
        rowKey="id"
        actions={actions}
        loading={loading}
        emptyMessage="Không có sinh viên nào"
      />
    </Box>
  );
}
