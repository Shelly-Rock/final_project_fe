"use client";

import { Typography, Chip } from "@mui/material";
import {
  Check as CheckIcon,
  X as XIcon,
  Visibility as EyeIcon,
} from "@mui/icons-material";
import { DataTable } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { Submission, SubmissionStatus } from "../services";

interface SubmissionWithName extends Submission {
  studentName?: string;
  studentMssv?: string;
  projectCode?: string;
  projectName?: string;
}

interface SubmissionTableProps {
  submissions: SubmissionWithName[];
  loading?: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onApprove: (submission: SubmissionWithName) => void;
  onReject: (submission: SubmissionWithName) => void;
  onView: (submission: SubmissionWithName) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (pageSize: number) => void;
}

const statusColors: Record<
  SubmissionStatus,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

const statusLabels: Record<SubmissionStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export function SubmissionTable({
  submissions,
  loading = false,
  pagination,
  onApprove,
  onReject,
  onView,
  onPageChange,
  onRowsPerPageChange,
}: SubmissionTableProps) {
  const columns: Column<SubmissionWithName>[] = [
    {
      id: "studentMssv",
      label: "MSSV",
      format: (_, row) => row.studentMssv,
      minWidth: 120,
    },
    {
      id: "studentName",
      label: "Sinh viên",
      format: (_, row) => row.studentName,
    },
    {
      id: "projectCode",
      label: "Mã đề tài",
      format: (_, row) => row.projectCode,
      minWidth: 150,
    },
    {
      id: "projectName",
      label: "Tên đề tài",
      format: (_, row) => row.projectName,
    },
    {
      id: "fileName",
      label: "File",
      format: (_, row) => (
        <Typography
          component="a"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.open(row.fileName, "_blank");
          }}
          sx={{
            color: "primary.main",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {row.fileName}
        </Typography>
      ),
    },
    {
      id: "submittedAt",
      label: "Ngày nộp",
      format: (_, row) => new Date(row.submittedAt).toLocaleDateString("vi-VN"),
      minWidth: 120,
    },
    {
      id: "status",
      label: "Trạng thái",
      format: (_, row) => {
        const status = row.status as SubmissionStatus;
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

  const actions: Action<SubmissionWithName>[] = [
    {
      id: "approve",
      icon: <CheckIcon fontSize="small" />,
      label: "Duyệt",
      color: "success" as const,
      onClick: (row) => onApprove(row),
      disabled: (row) => row.status !== "PENDING",
    },
    {
      id: "reject",
      icon: <XIcon fontSize="small" />,
      label: "Từ chối",
      color: "error" as const,
      onClick: (row) => onReject(row),
      disabled: (row) => row.status !== "PENDING",
    },
    {
      id: "view",
      icon: <EyeIcon fontSize="small" />,
      label: "Xem",
      color: "primary" as const,
      onClick: (row) => onView(row),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={submissions}
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
