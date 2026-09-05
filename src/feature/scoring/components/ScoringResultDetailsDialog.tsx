"use client";

import { Box, Grid, Typography, Chip } from "@mui/material";
import { Dialog } from "@/shared/components";
import { Card, CardContentDiv } from "@/shared/components";
import { DataTable } from "@/shared/components";
import type { ScoringResult } from "../services";

interface ScoringResultDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  result: ScoringResult | null;
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
      description={result?.project?.projectName}
      size="lg"
    >
      {result && (
        <Box sx={{ mt: 2 }}>
          {/* Summary */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Card>
                <CardContentDiv padding={2}>
                  <Typography variant="caption" color="text.secondary">
                    Điểm GVHD
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color:
                        (result.gvhdScore || 0) < 4 ? "#ef4444" : "#22c55e",
                    }}
                  >
                    {result.gvhdScore !== null ? `${result.gvhdScore}/10` : "-"}
                  </Typography>
                </CardContentDiv>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContentDiv padding={2}>
                  <Typography variant="caption" color="text.secondary">
                    Điểm Hội đồng
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {result.totalCommitteeScores}/4
                  </Typography>
                </CardContentDiv>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContentDiv padding={2}>
                  <Typography variant="caption" color="text.secondary">
                    Kết quả
                  </Typography>
                  <Box sx={{ mt: 1 }}>{getFinalStatusBadge(result)}</Box>
                </CardContentDiv>
              </Card>
            </Grid>
          </Grid>

          {/* Committee Scores */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Điểm của Hội đồng
          </Typography>
          <DataTable
            columns={[
              {
                id: "role",
                label: "Vai trò",
                format: (
                  _,
                  row: {
                    role: string;
                    teacherName: string;
                    score: number | null;
                  },
                ) => row.role,
              },
              {
                id: "teacherName",
                label: "Người chấm",
                format: (
                  _,
                  row: {
                    role: string;
                    teacherName: string;
                    score: number | null;
                  },
                ) => row.teacherName,
              },
              {
                id: "score",
                label: "Điểm",
                format: (
                  _,
                  row: {
                    role: string;
                    teacherName: string;
                    score: number | null;
                  },
                ) =>
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
                format: (
                  _,
                  row: {
                    role: string;
                    teacherName: string;
                    score: number | null;
                  },
                ) =>
                  row.score !== null ? (
                    row.score < 4 ? (
                      <Chip label="Rớt" size="small" color="error" />
                    ) : (
                      <Chip label="Đạt" size="small" color="success" />
                    )
                  ) : null,
              },
            ]}
            rows={result.committeeScores as unknown[]}
            rowKey="teacherName"
            showSearchInput={false}
            showFilterButton={false}
            showExportButton={false}
            showImportButton={false}
            emptyMessage="Không có dữ liệu"
          />
        </Box>
      )}
    </Dialog>
  );
}
