"use client";

import { Box, Typography, Chip } from "@mui/material";
import { Info as InfoIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { DataTable } from "@/shared/components";
import type { Column, Action, FilterOption } from "@/shared/components";
import type { Score, ScoringStatus, ScoringType } from "../services";
import {
  ScoringTypeLabels,
  ScoringStatusLabels,
  CommitteeRoleLabels,
} from "../services";

interface ScoringTableProps {
  scores: Score[];
  loading?: boolean;
  page: number;
  total: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  scoringType: ScoringType | "ALL";
  onScoringTypeChange: (value: ScoringType | "ALL") => void;
  status: ScoringStatus | "ALL";
  onStatusChange: (value: ScoringStatus | "ALL") => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onView: (score: Score) => void;
}

const formatStudentName = (score: Score) => {
  const s = score.student;
  if (!s) return "-";
  return (
    [s.lastName, s.middleName, s.firstName].filter(Boolean).join(" ") || "-"
  );
};

const isOverdue = (score: Score) => {
  if (!score.deadline) return false;
  if (["SUBMITTED", "PASSED", "FAILED"].includes(score.status)) return false;
  return new Date(score.deadline).getTime() < Date.now();
};

const getStatusBadge = (score: Score) => {
  if (isOverdue(score)) {
    return <Chip label="Quá hạn" color="error" size="small" />;
  }
  const colorMap: Record<
    ScoringStatus,
    "default" | "warning" | "success" | "error" | "info"
  > = {
    PENDING: "default",
    IN_PROGRESS: "warning",
    SUBMITTED: "success",
    FAILED: "error",
    PASSED: "success",
  };
  return (
    <Chip
      label={ScoringStatusLabels[score.status]}
      color={colorMap[score.status]}
      size="small"
    />
  );
};

export function ScoringTable({
  scores,
  loading = false,
  page,
  total,
  searchQuery,
  onSearchChange,
  scoringType,
  onScoringTypeChange,
  status,
  onStatusChange,
  onPageChange,
  onRefresh,
  onView,
}: ScoringTableProps) {
  const columns: Column<Score>[] = [
    {
      id: "student",
      label: "Sinh viên",
      minWidth: 160,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatStudentName(row)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.student?.studentId || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "project",
      label: "Đề tài",
      minWidth: 220,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.project?.projectName || "-"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.project?.projectCode || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "teacher",
      label: "Người chấm",
      minWidth: 150,
      format: (_, row) => (
        <Box>
          <Typography variant="body2">{row.teacher?.name || "-"}</Typography>
          {row.role && (
            <Typography variant="caption" color="text.secondary">
              {CommitteeRoleLabels[row.role]}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: "scoringType",
      label: "Loại",
      format: (_, row) => (
        <Chip
          label={row.scoringType === "GVHD" ? "GVHD" : "Hội đồng"}
          size="small"
          sx={{
            fontWeight: 600,
            bgcolor: row.scoringType === "GVHD" ? "#f5f3ff" : "#eff6ff",
            color: row.scoringType === "GVHD" ? "#7c3aed" : "#2563eb",
          }}
        />
      ),
    },
    {
      id: "score",
      label: "Điểm",
      align: "center",
      format: (_, row) =>
        row.score !== null ? (
          <Typography
            sx={{
              fontWeight: 700,
              color: row.score < 4 ? "#ef4444" : "#0f172a",
            }}
          >
            {row.score}
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              /{row.maxScore || 10}
            </Typography>
          </Typography>
        ) : (
          <Typography variant="body2" color="text.disabled">
            —
          </Typography>
        ),
    },
    {
      id: "deadline",
      label: "Hạn chấm",
      format: (_, row) => {
        if (!row.deadline) return "—";
        const overdue = isOverdue(row);
        return (
          <Typography
            variant="body2"
            sx={{
              color: overdue ? "#ef4444" : "text.secondary",
              fontWeight: overdue ? 600 : 400,
            }}
          >
            {new Date(row.deadline).toLocaleDateString("vi-VN")}
          </Typography>
        );
      },
    },
    {
      id: "status",
      label: "Trạng thái",
      align: "center",
      format: (_, row) => getStatusBadge(row),
    },
  ];

  const actions: Action<Score>[] = [
    {
      id: "detail",
      label: "Chi tiết phiếu",
      icon: <InfoIcon fontSize="small" />,
      onClick: onView,
      color: "primary",
    },
  ];

  const statusFilters: FilterOption[] = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Chưa chấm" },
    { value: "IN_PROGRESS", label: "Đang chấm" },
    { value: "SUBMITTED", label: "Đã nộp" },
    { value: "PASSED", label: "Đạt" },
    { value: "FAILED", label: "Rớt" },
  ];

  const typeFilters: FilterOption[] = [
    { value: "ALL", label: "Tất cả loại" },
    { value: "GVHD", label: "GVHD" },
    { value: "COMMITTEE", label: "Hội đồng" },
  ];

  return (
    <DataTable
      columns={columns}
      rows={scores}
      rowKey="id"
      actions={actions}
      loading={loading}
      emptyMessage="Không có phiếu chấm"
      totalCount={total}
      page={page - 1}
      rowsPerPage={20}
      onPageChange={(newPage) => onPageChange(newPage + 1)}
      showSearchInput
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      showFilterButton
      filterOptions={statusFilters}
      filterValue={status}
      onFilterChange={(v) => onStatusChange(v as ScoringStatus | "ALL")}
      cascadingFilterLabel="Loại"
      cascadingFilterOptions={typeFilters}
      cascadingFilterValue={scoringType}
      onCascadingFilterChange={(v) =>
        onScoringTypeChange(v as ScoringType | "ALL")
      }
      showExportButton
      showImportButton={false}
      headerActions={[
        {
          id: "refresh",
          label: "Làm mới",
          icon: <RefreshIcon fontSize="small" />,
          onClick: onRefresh,
          variant: "outlined",
        },
      ]}
    />
  );
}
