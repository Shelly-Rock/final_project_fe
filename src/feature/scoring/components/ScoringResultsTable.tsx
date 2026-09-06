"use client";

import { Box, Typography, Chip } from "@mui/material";
import { Visibility as EyeIcon } from "@mui/icons-material";
import { DataTable } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { ScoringResult } from "../services";

interface ScoringResultsTableProps {
  results: ScoringResult[];
  loading?: boolean;
  page: number;
  total: number;
  onViewDetails: (projectId: number) => void;
  onPageChange: (page: number) => void;
}

const getFinalStatusBadge = (result: ScoringResult) => {
  if (result.isEliminated) {
    if (result.isGvhdFailed) {
      return <Chip label="Loại (GVHD)" color="error" size="small" />;
    }
    return <Chip label="Loại (Hội đồng)" color="error" size="small" />;
  }
  return <Chip label="Đạt" color="success" size="small" />;
};

export function ScoringResultsTable({
  results,
  loading = false,
  page,
  total,
  onViewDetails,
  onPageChange,
}: ScoringResultsTableProps) {
  const columns: Column<ScoringResult>[] = [
    {
      id: "project",
      label: "Đề tài",
      minWidth: 200,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.project?.projectCode}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.project?.projectName}
          </Typography>
        </Box>
      ),
    },
    {
      id: "student",
      label: "Sinh viên",
      format: (_, row) =>
        `${row.student?.firstName} ${row.student?.middleName} ${row.student?.lastName}`,
    },
    {
      id: "gvhdScore",
      label: "GVHD",
      format: (_, row: ScoringResult) =>
        row.gvhdScore !== null ? (
          <Typography
            sx={{
              fontWeight: 600,
              color: row.gvhdScore < 4 ? "#ef4444" : "#22c55e",
            }}
          >
            {row.gvhdScore}/10
          </Typography>
        ) : (
          <Chip label="Chưa chấm" size="small" color="default" />
        ),
    },
    {
      id: "committeeScores",
      label: "Hội đồng",
      format: (_, row: ScoringResult) =>
        row.totalCommitteeScores > 0 ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="body2">
              {row.totalCommitteeScores}/4 đã chấm
            </Typography>
            {row.failedCount > 0 && (
              <Chip
                label={`${row.failedCount} rớt`}
                size="small"
                color="error"
              />
            )}
          </Box>
        ) : (
          <Chip label="Chưa chấm" size="small" color="default" />
        ),
    },
    {
      id: "finalStatus",
      label: "Kết quả",
      format: (_, row) => getFinalStatusBadge(row),
    },
  ];

  const actions: Action<ScoringResult>[] = [
    {
      id: "view",
      icon: <EyeIcon fontSize="small" />,
      label: "Chi tiết",
      color: "primary" as const,
      onClick: (row: ScoringResult) =>
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
      showSearchInput={false}
      showFilterButton={false}
      showExportButton={false}
      showImportButton={false}
      emptyMessage="Không có dữ liệu"
      totalCount={total}
      page={page - 1}
      rowsPerPage={25}
      onPageChange={(newPage) => onPageChange(newPage + 1)}
    />
  );
}
