"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { DataTable } from "@/shared/components";
import { Badge } from "@/shared/components";
import type { Column, Action, HeaderAction } from "@/shared/components";
import type { RegistrationPeriod } from "../types";

interface PeriodTableProps {
  periods: RegistrationPeriod[];
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  onEdit: (period: RegistrationPeriod) => void;
  onDelete: (period: RegistrationPeriod) => void;
  onCreate: () => void;
}

const statusConfig = {
  upcoming: { label: "Sắp mở", color: "warning" as const },
  open: { label: "Đang mở", color: "success" as const },
  closed: { label: "Đã đóng", color: "default" as const },
};

const semesterLabel = {
  "1": "HK1",
  "2": "HK2",
  "3": "HK Hè",
};

export function PeriodTable({
  periods,
  loading = false,
  searchValue = "",
  onSearchChange,
  filterValue = "all",
  onFilterChange,
  onEdit,
  onDelete,
  onCreate,
}: PeriodTableProps) {
  const router = useRouter();

  const columns: Column<RegistrationPeriod>[] = [
    {
      id: "name",
      label: "Tên đợt",
      minWidth: 200,
      format: (_, row) => <span style={{ fontWeight: 500 }}>{row.name}</span>,
    },
    {
      id: "semester",
      label: "Học kỳ",
      minWidth: 80,
      align: "center",
      format: (val) => {
        const semesterVal = val as string;
        return (
          semesterLabel[semesterVal as keyof typeof semesterLabel] ||
          semesterVal
        );
      },
    },
    {
      id: "schoolYear",
      label: "Năm học",
      minWidth: 100,
      align: "center",
    },
    {
      id: "startDate",
      label: "Ngày bắt đầu",
      minWidth: 110,
      format: (val) => {
        const date = new Date(val as string);
        return date.toLocaleDateString("vi-VN");
      },
    },
    {
      id: "teacherDeadline",
      label: "Hạn GV nộp",
      minWidth: 110,
      format: (val) => {
        const date = new Date(val as string);
        return date.toLocaleDateString("vi-VN");
      },
    },
    {
      id: "studentDeadline",
      label: "Hạn SV đăng ký",
      minWidth: 130,
      format: (val) => {
        const date = new Date(val as string);
        return date.toLocaleDateString("vi-VN");
      },
    },
    {
      id: "defaultQuota",
      label: "Chỉ tiêu",
      minWidth: 80,
      align: "center",
      format: (val) => `${val} đề tài/GV`,
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 100,
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

  const actions: Action<RegistrationPeriod>[] = [
    {
      id: "view",
      icon: <ViewIcon fontSize="small" />,
      label: "Xem chi tiết",
      color: "inherit" as const,
      onClick: (row) => router.push(`/registration-periods/${row.id}`),
    },
    {
      id: "edit",
      icon: <EditIcon fontSize="small" />,
      label: "Sửa",
      color: "primary" as const,
      onClick: (row) => onEdit(row),
    },
    {
      id: "delete",
      icon: <DeleteIcon fontSize="small" />,
      label: "Xóa",
      color: "error" as const,
      onClick: (row) => onDelete(row),
    },
  ];

  const headerActions: HeaderAction[] = [
    {
      id: "create",
      icon: <Plus size={18} />,
      label: "Tạo mới",
      onClick: onCreate,
      variant: "contained",
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={periods}
      rowKey="id"
      actions={actions}
      headerActions={headerActions}
      loading={loading}
      emptyMessage="Chưa có đợt đăng ký nào"
      showSearchInput
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      showFilterButton
      filterOptions={[
        { value: "all", label: "Tất cả" },
        { value: "open", label: "Đang mở" },
        { value: "upcoming", label: "Sắp mở" },
        { value: "closed", label: "Đã đóng" },
      ]}
      filterValue={filterValue}
      onFilterChange={onFilterChange}
      showExportButton
      showImportButton={false}
    />
  );
}
