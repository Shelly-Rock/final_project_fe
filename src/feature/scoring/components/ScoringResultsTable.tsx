"use client";

import { Box, Typography, Chip, LinearProgress } from "@mui/material";
import {
  Visibility as EyeIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { DataTable } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { ScoringResult } from "../services";

interface ScoringResultsTableProps {
  results: ScoringResult[];
  loading?: boolean;
  page: number;
  total: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onViewDetails: (projectId: number) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const formatStudentName = (row: ScoringResult) => {
  const s = row.student;
  if (!s) return "-";
  return (
    [s.lastName, s.middleName, s.firstName].filter(Boolean).join(" ") || "-"
  );
};

const getFinalStatusBadge = (result: ScoringResult) => {
  if (result.isEliminated) {
    return (
      <Chip
        label={result.isGvhdFailed ? "Loại (GVHD)" : "Loại (Hội đồng)"}
        color="error"
        size="small"
      />
    );
  }
  if (
    result.finalStatus === "PASSED" ||
    (!result.isEliminated && result.gvhdScore !== null)
  ) {
    return <Chip label="Đạt" color="success" size="small" />;
  }
  return <Chip label="Đang chấm" color="warning" size="small" />;
};

export function ScoringResultsTable({
  results,
  loading = false,
  page,
  total,
  searchQuery,
  onSearchChange,
  onViewDetails,
  onPageChange,
  onRefresh,
}: ScoringResultsTableProps) {
  const columns: Column<ScoringResult>[] = [
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
      id: "gvhdScore",
      label: "GVHD",
      align: "center",
      format: (_, row) =>
        row.gvhdScore !== null ? (
          <Typography
            sx={{
              fontWeight: 700,
              color: row.gvhdScore < 4 ? "#ef4444" : "#10b981",
            }}
          >
            {row.gvhdScore}
          </Typography>
        ) : (
          <Chip label="Chưa chấm" size="small" />
        ),
    },
    {
      id: "committeeScores",
      label: "Hội đồng",
      minWidth: 160,
      format: (_, row) => {
        const total = Math.max(
          row.totalCommitteeScores,
          row.committeeScores?.length || 4,
        );
        const done =
          row.committeeScores?.filter((s) => s.score !== null).length ??
          row.totalCommitteeScores;
        const pct = total > 0 ? (done / total) * 100 : 0;
        return (
          <Box sx={{ minWidth: 120 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {done}/{total} đã chấm
            </Typography>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "#e2e8f0",
                "& .MuiLinearProgress-bar": {
                  bgcolor: row.failedCount > 0 ? "#ef4444" : "#3b82f6",
                  borderRadius: 3,
                },
              }}
            />
            {row.failedCount > 0 && (
              <Typography variant="caption" sx={{ color: "#ef4444" }}>
                {row.failedCount} phiếu rớt
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      id: "finalStatus",
      label: "Kết quả",
      align: "center",
      format: (_, row) => getFinalStatusBadge(row),
    },
  ];

  const actions: Action<ScoringResult>[] = [
    {
      id: "view",
      icon: <EyeIcon fontSize="small" />,
      label: "Chi tiết",
      color: "primary",
      onClick: (row) =>
        onViewDetails(Number(row.project?.projectId || row.projectId)),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={results}
      rowKey="id"
      actions={actions}
      loading={loading}
      emptyMessage="Chưa có kết quả tổng hợp"
      totalCount={total}
      page={page - 1}
      rowsPerPage={20}
      onPageChange={(newPage) => onPageChange(newPage + 1)}
      showSearchInput
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      showFilterButton={false}
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
