"use client";

import { Box, Typography, Chip } from "@mui/material";
import { DataTable } from "@/shared/components";
import type { Column } from "@/shared/components";
import type { Score, ScoringStatus } from "../services";
import { ScoringTypeLabels, ScoringStatusLabels } from "../services";

interface ScoringTableProps {
  scores: Score[];
  loading?: boolean;
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}

const getStatusBadge = (status: ScoringStatus) => {
  const colorMap: Record<
    ScoringStatus,
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
  > = {
    PENDING: "default",
    IN_PROGRESS: "warning",
    SUBMITTED: "success",
    FAILED: "error",
    PASSED: "success",
  };
  return (
    <Chip
      label={ScoringStatusLabels[status]}
      color={colorMap[status]}
      size="small"
    />
  );
};

export function ScoringTable({
  scores,
  loading = false,
  page,
  total,
  onPageChange,
}: ScoringTableProps) {
  const columns: Column<Score>[] = [
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
      id: "teacher",
      label: "Người chấm",
      format: (_, row) => row.teacher?.name,
    },
    {
      id: "scoringType",
      label: "Loại",
      format: (_, row) => ScoringTypeLabels[row.scoringType],
    },
    {
      id: "score",
      label: "Điểm",
      format: (_, row) =>
        row.score !== null ? (
          <Typography
            sx={{
              fontWeight: 600,
              color: row.score < 4 ? "#ef4444" : "inherit",
            }}
          >
            {row.score}/10
          </Typography>
        ) : (
          "-"
        ),
    },
    {
      id: "status",
      label: "Trạng thái",
      format: (_, row) => getStatusBadge(row.status),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={scores}
      rowKey="id"
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
