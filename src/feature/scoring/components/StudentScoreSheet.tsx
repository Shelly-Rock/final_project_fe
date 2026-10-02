"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { Card, CardContentDiv, CardHeader } from "@/shared/components";
import {
  CommitteeRoleLabels,
  getMyTranscript,
  type CommitteeRole,
  type TranscriptDetail,
} from "../services";

const INTERNAL_COMMITTEE_ROLES: CommitteeRole[] = [
  "CHAIRMAN",
  "SECRETARY",
  "INTERNAL_REVIEWER",
];

function studentName(detail: TranscriptDetail) {
  if (!detail.student) return "-";
  return [
    detail.student.lastName,
    detail.student.middleName,
    detail.student.firstName,
  ]
    .filter(Boolean)
    .join(" ");
}

export function StudentScoreSheetPage() {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<TranscriptDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyTranscript();
        if (response.available === false) {
          setDetail(null);
          setError(response.reason || null);
          return;
        }
        setDetail(response);
      } catch (err) {
        setError((err as Error).message || "Bảng điểm chưa được công bố");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !detail) {
    return (
      <Alert severity="info">
        {error || "Bảng điểm chưa được công bố. Vui lòng quay lại sau."}
      </Alert>
    );
  }

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Đề tài
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {detail.projectCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {detail.projectName}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {studentName(detail)} · {detail.student?.studentId}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption" color="text.secondary">
                Điểm tổng
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {detail.finalScore.toFixed(2)}
              </Typography>
              <Chip
                size="small"
                color={detail.isFinalPassed ? "success" : "error"}
                label={detail.isFinalPassed ? "Đạt" : "Không đạt"}
                sx={{ mt: 1 }}
              />
              {detail.isPublished && detail.publishedAt && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  Công bố:{" "}
                  {new Date(detail.publishedAt).toLocaleString("vi-VN")}
                </Typography>
              )}
            </CardContentDiv>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption">GVHD (40%)</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {detail.gvhdScore.toFixed(2)}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption">Phản biện ngoài (20%)</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {detail.externalScore.toFixed(2)}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption">Hội đồng 3 TV (40%)</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {detail.othersAverage.toFixed(2)}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContentDiv padding={2}>
              <Typography variant="caption">Điểm cộng</Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {detail.bonusScore.toFixed(2)}
              </Typography>
            </CardContentDiv>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Điểm từng thành viên hội đồng"
          subtitle="Ba phiếu Chủ tịch, Thư ký hội đồng và Phản biện trong được tính trung bình với trọng số 40%."
        />
        <CardContentDiv padding={2}>
          <Box>
            {INTERNAL_COMMITTEE_ROLES.map((role, index, roles) => {
              const score = detail.otherScores.find((row) => row.role === role);
              return (
                <Box
                  key={role}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    py: 1.5,
                    borderBottom:
                      index < roles.length - 1 ? "1px solid" : undefined,
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {CommitteeRoleLabels[role]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {score?.teacherName ?? "Chưa có thông tin giảng viên"}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={700}>
                    {score?.score == null ? "—" : score.score.toFixed(2)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 2,
              pt: 1.5,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Trung bình ba thành viên nội bộ
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {detail.othersAverage.toFixed(2)}
            </Typography>
          </Box>
        </CardContentDiv>
      </Card>

      <Card>
        <CardHeader
          title="Nhận xét phản biện và hội đồng"
          subtitle="Ý kiến từ phản biện ngoài và từng thành viên nội bộ"
        />
        <CardContentDiv padding={2}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {detail.comments.map((row, index) => (
              <Box
                key={`${row.teacherName}-${index}`}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  {row.teacherName}
                  {row.role
                    ? ` · ${CommitteeRoleLabels[row.role as CommitteeRole]}`
                    : ""}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      Ưu điểm
                    </Typography>
                    <Typography variant="body2">
                      {row.strengths || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      Nhược điểm
                    </Typography>
                    <Typography variant="body2">
                      {row.weaknesses || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      Nhận xét
                    </Typography>
                    <Typography variant="body2">{row.notes || "-"}</Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </CardContentDiv>
      </Card>

      {detail.bonusNote && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          Lý do cộng điểm: {detail.bonusNote}
        </Typography>
      )}
    </Box>
  );
}
