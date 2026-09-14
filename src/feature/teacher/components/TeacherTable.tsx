"use client";

import React, { useMemo } from "react";
import { Typography, useTheme } from "@mui/material";
import { Badge } from "@/shared/components";
import { Edit as EditIcon, Block } from "@mui/icons-material";
import { Plus, RefreshCw, Download, Upload } from "lucide-react";
import { DataTable } from "@/shared/components";
import type { Column, Action, HeaderAction } from "@/shared/components";
import type { Lecturer } from "@/feature/admin/types";

interface TeacherTableProps {
  teachers: Lecturer[];
  loading?: boolean;
  filterFaculty?: string;
  filterDepartment?: string;
  onFilterFacultyChange?: (value: string) => void;
  onFilterDepartmentChange?: (value: string) => void;
  faculties?: { id: string; name: string }[];
  departments?: { id: string; name: string }[];
  allFaculties?: { id: string; name: string }[];
  allDepartments?: { id: string; name: string; facultyId: string }[];
  onEdit: (teacher: Lecturer) => void;
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
  filterFaculty = "all",
  filterDepartment = "all",
  onFilterFacultyChange,
  onFilterDepartmentChange,
  faculties = [],
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

  // Build filter options for Faculty (for DataTable dropdown)
  const facultyFilterOptions = [
    { value: "all", label: "Tất cả Khoa" },
    ...faculties.map((f) => ({ value: f.id, label: f.name })),
  ];

  // Build filter options for Department (cascading)
  const departmentFilterOptions = [
    { value: "all", label: "Tất cả Bộ môn" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];

  // Memoized lookup helpers
  const getFacultyNameById = useMemo(() => {
    const map = new Map(faculties.map((f) => [f.id, f.name]));
    return (id: string) => map.get(id) ?? "Không xác định";
  }, [faculties]);

  const getDepartmentNameById = useMemo(() => {
    const map = new Map(departments.map((d) => [d.id, d.name]));
    return (id: string) => map.get(id) ?? "Không xác định";
  }, [departments]);

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
      id: "departmentId",
      label: "Bộ môn",
      minWidth: 180,
      format: (_, row) => (
        <Typography variant="body2" sx={{ color: textColor }}>
          {getDepartmentNameById(row.departmentId)}
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

  const actions: Action<Lecturer>[] = [
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
      // Primary filter (Khoa)
      filterOptions={facultyFilterOptions}
      filterValue={filterFaculty}
      onFilterChange={onFilterFacultyChange}
      showFilterButton={true}
      // Cascading filter (Bộ môn)
      cascadingFilterOptions={departmentFilterOptions}
      cascadingFilterValue={filterDepartment}
      cascadingFilterLabel="Bộ môn"
      onCascadingFilterChange={onFilterDepartmentChange}
      showExportButton={false}
      showImportButton={false}
      loading={loading}
      emptyMessage="Chưa có giảng viên nào"
    />
  );
}
