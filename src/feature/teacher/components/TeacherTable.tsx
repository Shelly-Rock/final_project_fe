"use client";

import React, { useMemo } from "react";
import { Typography, useTheme } from "@mui/material";
import { Badge } from "@/shared/components";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { Plus, RefreshCw, Download, FileUp, Trash2 } from "lucide-react";
import { DataTable } from "@/shared/components";
import type { Column, Action, HeaderAction } from "@/shared/components";
import type { Lecturer } from "@/feature/admin/types";

interface TeacherTableProps {
  teachers: Lecturer[];
  loading?: boolean;
  filterFaculty?: string;
  onFilterFacultyChange?: (value: string) => void;
  faculties?: { id: string; name: string }[];
  allFaculties?: { id: string; name: string }[];
  onView?: (teacher: Lecturer) => void;
  onEdit?: (teacher: Lecturer) => void;
  onDelete?: (teacher: Lecturer) => void;
  onDeleteMany?: (teachers: Lecturer[]) => void;
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
  faculties = [],
  onView,
  onEdit,
  onDelete,
  onDeleteMany,
  onRefresh,
  onAdd,
  onImport,
  onExport,
}: TeacherTableProps) {
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const textColor = isDarkMode ? "#cbd5e1" : "#0F172A";
  const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";

  // Memoized lookup helpers
  const getFacultyNameById = useMemo(() => {
    const map = new Map(faculties.map((f) => [f.id, f.name]));
    return (id: string) => map.get(id) ?? "Không xác định";
  }, [faculties]);

  const columns: Column<Lecturer>[] = [
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
      id: "name",
      label: "Họ tên",
      minWidth: 180,
      format: (_, row) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: textColor }}>
          {row.name}
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
      label: "SĐT",
      minWidth: 110,
      format: (_, row) => (
        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
          {row.phone || "—"}
        </Typography>
      ),
    },
    {
      id: "facultyId",
      label: "Khoa",
      minWidth: 180,
      format: (_, row) => (
        <Typography variant="body2" sx={{ color: textColor }}>
          {getFacultyNameById(row.facultyId)}
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
          <Badge label={config.label} color={config.color} variant="outlined" />
        );
      },
    },
  ];

  const actions: Action<Lecturer>[] = [
    {
      id: "view",
      icon: <ViewIcon fontSize="small" />,
      label: "Xem chi tiết",
      color: "inherit" as const,
      onClick: (row) => onView?.(row),
    },
    {
      id: "edit",
      icon: <EditIcon fontSize="small" />,
      label: "Sửa",
      color: "primary" as const,
      onClick: (row) => onEdit?.(row),
    },
    {
      id: "delete",
      icon: <DeleteIcon fontSize="small" />,
      label: "Xóa",
      color: "error" as const,
      onClick: (row) => onDelete?.(row),
    },
  ];

  const headerActions: HeaderAction[] = [
    ...(onDeleteMany && selectedKeys.length > 0
      ? [
          {
            id: "delete-selected",
            icon: <Trash2 size={16} />,
            label: `Xóa ${selectedKeys.length} giảng viên`,
            onClick: () => {
              const selected = teachers.filter((teacher) =>
                selectedKeys.includes(String(teacher.id)),
              );
              onDeleteMany(selected);
              setSelectedKeys([]);
            },
            variant: "outlined" as const,
          },
        ]
      : []),
    ...(onExport
      ? [
          {
            id: "export",
            icon: <Download size={16} />,
            label: "Export",
            onClick: onExport,
            variant: "outlined" as const,
          },
        ]
      : []),
    ...(onImport
      ? [
          {
            id: "import",
            icon: <FileUp size={16} />,
            label: "Import",
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
      selectable={true}
      selectedRowKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      actions={actions}
      headerActions={headerActions}
      showSearchInput={false}
      showFilterButton={false}
      showExportButton={false}
      showImportButton={false}
      loading={loading}
      emptyMessage="Chưa có giảng viên nào"
    />
  );
}
