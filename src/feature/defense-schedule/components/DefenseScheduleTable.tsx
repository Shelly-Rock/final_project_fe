"use client";

import { Chip } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { DataTable } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { DefenseSession, DefenseSessionStatus } from "../services";
import dayjs from "dayjs";

const statusColors: Record<
  DefenseSessionStatus,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  SCHEDULED: "info",
  COMPLETED: "success",
  CANCELLED: "error",
  RESCHEDULED: "warning",
};

const statusLabels: Record<DefenseSessionStatus, string> = {
  SCHEDULED: "Đã lên lịch",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  RESCHEDULED: "Đổi lịch",
};

interface DefenseScheduleTableProps {
  sessions: DefenseSession[];
  loading?: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onEdit: (session: DefenseSession) => void;
  onDelete: (session: DefenseSession) => void;
  onComplete: (sessionId: number) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (pageSize: number) => void;
}

const formatDate = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY");
};

export function DefenseScheduleTable({
  sessions,
  loading = false,
  pagination,
  onEdit,
  onDelete,
  onComplete,
  onPageChange,
  onRowsPerPageChange,
}: DefenseScheduleTableProps) {
  const columns: Column<DefenseSession>[] = [
    {
      id: "committeeName",
      label: "Hội đồng",
      format: (_, row) => row.committeeName,
    },
    {
      id: "defenseDate",
      label: "Ngày bảo vệ",
      format: (_, row) => formatDate(row.defenseDate),
      minWidth: 120,
    },
    {
      id: "startTime",
      label: "Giờ bắt đầu",
      format: (_, row) => row.startTime,
      minWidth: 100,
    },
    {
      id: "estimatedEndTime",
      label: "Giờ kết thúc",
      format: (_, row) => row.estimatedEndTime || "-",
      minWidth: 100,
    },
    {
      id: "room",
      label: "Phòng",
      format: (_, row) => row.room,
      minWidth: 80,
    },
    {
      id: "projectCount",
      label: "Số đề tài",
      format: (_, row) => (
        <Chip label={row.projectCount} size="small" color="primary" />
      ),
      minWidth: 100,
    },
    {
      id: "status",
      label: "Trạng thái",
      format: (_, row) => {
        const status = row.status as DefenseSessionStatus;
        return (
          <Chip
            label={statusLabels[status]}
            size="small"
            color={statusColors[status]}
          />
        );
      },
      minWidth: 120,
    },
  ];

  const actions: Action<DefenseSession>[] = [
    {
      id: "edit",
      icon: <EditIcon fontSize="small" />,
      label: "Sửa",
      color: "primary" as const,
      onClick: (row) => onEdit(row),
      disabled: (row) => row.status === "COMPLETED",
    },
    {
      id: "complete",
      icon: <CheckIcon fontSize="small" />,
      label: "Hoàn thành",
      color: "success" as const,
      onClick: (row) => onComplete(row.id),
      disabled: (row) => row.status !== "SCHEDULED",
    },
    {
      id: "delete",
      icon: <DeleteIcon fontSize="small" />,
      label: "Xóa",
      color: "error" as const,
      onClick: (row) => onDelete(row),
      disabled: (row) => row.status === "COMPLETED",
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={sessions}
      rowKey="id"
      actions={actions}
      loading={loading}
      showSearchInput={false}
      showFilterButton={false}
      showExportButton={false}
      showImportButton={false}
      emptyMessage="Không có dữ liệu"
      totalCount={pagination.total}
      page={pagination.current - 1}
      rowsPerPage={pagination.pageSize}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
}
