"use client";

import { Box, Grid, Typography, Chip, Divider } from "@mui/material";
import { Dialog } from "@/shared/components";
import { DataTable } from "@/shared/components";
import type { Score, ScoringResult } from "../services";
import {
  ScoringCriteria,
  ScoringStatusLabels,
  ScoringTypeLabels,
  CommitteeRoleLabels,
} from "../services";

interface ScoringResultDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  result: ScoringResult | null;
}

interface ScoreDetailDialogProps {
  open: boolean;
  onClose: () => void;
  score: Score | null;
}

const formatStudentName = (s?: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}) => {
  if (!s) return "-";
  return (
    [s.lastName, s.middleName, s.firstName].filter(Boolean).join(" ") || "-"
  );
};

const getFinalStatusBadge = (result: ScoringResult) => {
  if (result.isEliminated) {
    return (
      <Chip
        label={result.isGvhdFailed ? "Loại (GVHD < 4)" : "Loại (Hội đồng)"}
        color="error"
        size="small"
      />
    );
  }
  return <Chip label="Đạt" color="success" size="small" />;
};

const SummaryCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      border: "1px solid #e2e8f0",
      bgcolor: "#f8fafc",
      height: "100%",
    }}
  >
    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
      {label}
    </Typography>
    <Typography
      variant="h5"
      sx={{ fontWeight: 800, color: color || "#0f172a", mt: 0.5 }}
    >
      {value}
    </Typography>
  </Box>
);

export function ScoringResultDetailsDialog({
  open,
  onClose,
  result,
}: ScoringResultDetailsDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Chi tiết kết quả chấm điểm"
      description={
        result
          ? `${formatStudentName(result.student)} · ${result.project?.projectCode || ""}`
          : undefined
      }
      size="lg"
    >
      {result && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
            {result.project?.projectName || "-"}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <SummaryCard
                label="Điểm GVHD"
                value={
                  result.gvhdScore !== null
                    ? `${result.gvhdScore}/10`
                    : "Chưa chấm"
                }
                color={(result.gvhdScore ?? 10) < 4 ? "#ef4444" : "#10b981"}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <SummaryCard
                label="Phiếu hội đồng"
                value={`${result.totalCommitteeScores}/4`}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                  height: "100%",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#64748b", fontWeight: 600 }}
                >
                  Kết quả
                </Typography>
                <Box sx={{ mt: 1 }}>{getFinalStatusBadge(result)}</Box>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
            Điểm từng thành viên hội đồng
          </Typography>
          <DataTable
            columns={[
              {
                id: "role",
                label: "Vai trò",
                format: (_, row: ScoringResult["committeeScores"][number]) =>
                  CommitteeRoleLabels[row.role] || row.role,
              },
              {
                id: "teacherName",
                label: "Người chấm",
                format: (_, row: ScoringResult["committeeScores"][number]) =>
                  row.teacherName || "-",
              },
              {
                id: "score",
                label: "Điểm",
                format: (_, row: ScoringResult["committeeScores"][number]) =>
                  row.score !== null ? (
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: row.score < 4 ? "#ef4444" : "#0f172a",
                      }}
                    >
                      {row.score}/10
                    </Typography>
                  ) : (
                    "—"
                  ),
              },
              {
                id: "status",
                label: "Kết quả",
                format: (_, row: ScoringResult["committeeScores"][number]) =>
                  row.score !== null ? (
                    row.score < 4 ? (
                      <Chip label="Rớt" size="small" color="error" />
                    ) : (
                      <Chip label="Đạt" size="small" color="success" />
                    )
                  ) : (
                    <Chip label="Chưa chấm" size="small" />
                  ),
              },
            ]}
            rows={result.committeeScores || []}
            rowKey="teacherName"
            showSearchInput={false}
            showFilterButton={false}
            showExportButton={false}
            showImportButton={false}
            emptyMessage="Chưa có phiếu hội đồng"
          />
        </Box>
      )}
    </Dialog>
  );
}

export function ScoreDetailDialog({
  open,
  onClose,
  score,
}: ScoreDetailDialogProps) {
  if (!score) return null;

  const criteria = ScoringCriteria.map((c) => ({
    ...c,
    value: score.criteriaScores?.[c.key] ?? null,
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Chi tiết phiếu chấm"
      description={`${formatStudentName(score.student)} · ${ScoringTypeLabels[score.scoringType]}`}
      size="md"
    >
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
          {score.project?.projectName || "-"} (
          {score.project?.projectCode || "-"})
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Người chấm
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {score.teacher?.name || "-"}
            </Typography>
            {score.role && (
              <Typography variant="caption" color="text.secondary">
                {CommitteeRoleLabels[score.role]}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Điểm
            </Typography>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ color: (score.score ?? 10) < 4 ? "#ef4444" : "#0f172a" }}
            >
              {score.score !== null
                ? `${score.score}/${score.maxScore || 10}`
                : "—"}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Trạng thái
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip label={ScoringStatusLabels[score.status]} size="small" />
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Hạn chấm
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {score.deadline
                ? new Date(score.deadline).toLocaleDateString("vi-VN")
                : "—"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          Điểm theo tiêu chí
        </Typography>
        {criteria.map((c) => (
          <Box
            key={c.key}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: 0.75,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <Typography variant="body2">
              {c.label}{" "}
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
              >
                ({c.weight}%)
              </Typography>
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {c.value !== null ? c.value : "—"}
            </Typography>
          </Box>
        ))}

        {(score.strengths || score.weaknesses || score.notes) && (
          <Box
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
          >
            {score.strengths && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Điểm mạnh
                </Typography>
                <Typography variant="body2">{score.strengths}</Typography>
              </Box>
            )}
            {score.weaknesses && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Điểm yếu
                </Typography>
                <Typography variant="body2">{score.weaknesses}</Typography>
              </Box>
            )}
            {score.notes && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Nhận xét
                </Typography>
                <Typography variant="body2">{score.notes}</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
