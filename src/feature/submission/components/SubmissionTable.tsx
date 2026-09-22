"use client";

import { Typography, Chip, Box } from "@mui/material";
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
  filterValue?: SubmissionStatus | "";
  onFilterChange?: (value: SubmissionStatus | "") => void;
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

const STATUS_FILTERS: { value: SubmissionStatus | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
];

export function SubmissionTable({
  submissions,
  loading = false,
  pagination,
  onApprove,
  onReject,
  onView,
  onPageChange,
  onRowsPerPageChange,
  filterValue = "",
  onFilterChange,
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
      headerActions={[]}
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
      belowToolbar={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="caption"
            sx={{ color: "#64748b", fontWeight: 500, mr: 1 }}
          >
            Trạng thái:
          </Typography>
          <Box sx={{ display: "flex" }}>
            {STATUS_FILTERS.map((option, index) => (
              <Box
                key={option.value || "all"}
                onClick={() => onFilterChange?.(option.value)}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: filterValue === option.value ? 600 : 400,
                  color: filterValue === option.value ? "#fff" : "#2563eb",
                  backgroundColor:
                    filterValue === option.value ? "#2563eb" : "transparent",
                  border: "1px solid #2563eb",
                  cursor: "pointer",
                  borderRadius:
                    index === 0
                      ? "6px 0 0 6px"
                      : index === STATUS_FILTERS.length - 1
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
      }
    />
  );
}
