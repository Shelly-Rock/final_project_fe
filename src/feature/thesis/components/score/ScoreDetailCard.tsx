"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  Paper,
  Grid,
} from "@mui/material";
import {
  Person as StudentIcon,
  School as ThesisIcon,
  Star as ScoreIcon,
} from "@mui/icons-material";
import { getScoreColorSafe as getScoreColor, getLetterGrade } from "@/feature/thesis/constants";
import type { ThesisScore, SupervisorScore, ReviewerScore, ScoreWeightConfig } from "@/feature/thesis/types";

interface ScoreDetailCardProps {
  score: ThesisScore;
  supervisorScore?: SupervisorScore;
  reviewerScore?: ReviewerScore;
  weightConfig?: ScoreWeightConfig;
}

export function ScoreDetailCard({
  score,
  supervisorScore,
  reviewerScore,
  weightConfig,
}: ScoreDetailCardProps) {
  const renderScoreBar = (value: number | null, label: string, maxValue = 10) => {
    if (value === null) {
      return (
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Chưa có điểm
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="body2">{label}</Typography>
          <Typography variant="body2" fontWeight={500}>
            {value}/{maxValue}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(value / maxValue) * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "grey.200",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              bgcolor: `${getScoreColor(value)}.main`,
            },
          }}
        />
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Chi tiết điểm
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StudentIcon fontSize="small" color="action" />
              <Typography variant="body2">{score.student}</Typography>
            </Box>
            <Chip label={score.mssv || score.student} size="small" variant="outlined" />
          </Stack>
        </Box>
        {score.finalScore != null && score.finalScore > 0 && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" color={getScoreColor(score.finalScore)}>
              {score.finalScore}
            </Typography>
            <Chip
              label={getLetterGrade(score.finalScore)}
              color={getScoreColor(score.finalScore)}
              size="medium"
            />
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Score Breakdown */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Chi tiết điểm thành phần
      </Typography>

      <Grid container spacing={3}>
        {/* GVHD Score */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Điểm GVHD ({weightConfig?.supervisorWeight ? weightConfig.supervisorWeight * 100 : 40}%)
              </Typography>
              {supervisorScore ? (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {renderScoreBar(supervisorScore.progressScore, "Tiến độ")}
                  {renderScoreBar(supervisorScore.skillScore, "Kỹ năng/Kỹ thuật")}
                  {renderScoreBar(supervisorScore.attitudeScore, "Tinh thần/Thái độ")}
                  {renderScoreBar(supervisorScore.reportScore, "Chất lượng báo cáo")}
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" fontWeight={600}>
                      Tổng GVHD:
                    </Typography>
                    <Chip
                      label={supervisorScore.totalScore}
                      color={getScoreColor(supervisorScore.totalScore)}
                      size="small"
                    />
                  </Box>
                  {supervisorScore.supervisorComment && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Nhận xét:
                      </Typography>
                      <Typography variant="body2">{supervisorScore.supervisorComment}</Typography>
                    </Box>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Chưa có điểm GVHD
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Reviewer Score */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Điểm phản biện ({weightConfig?.reviewerWeight ? weightConfig.reviewerWeight * 100 : 20}%)
              </Typography>
              {reviewerScore ? (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {renderScoreBar(reviewerScore.contentScore, "Nội dung")}
                  {renderScoreBar(reviewerScore.methodologyScore, "Phương pháp NC")}
                  {renderScoreBar(reviewerScore.resultScore, "Kết quả đạt được")}
                  {renderScoreBar(reviewerScore.presentationScore, "Trình bày")}
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" fontWeight={600}>
                      Tổng phản biện:
                    </Typography>
                    <Chip
                      label={reviewerScore.totalScore}
                      color={getScoreColor(reviewerScore.totalScore)}
                      size="small"
                    />
                  </Box>
                  {reviewerScore.reviewerComment && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Nhận xét:
                      </Typography>
                      <Typography variant="body2">{reviewerScore.reviewerComment}</Typography>
                    </Box>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Chưa có điểm phản biện
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Council Score */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Điểm hội đồng ({weightConfig?.councilWeight ? weightConfig.councilWeight * 100 : 40}%)
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {score.defenseScore != null ? (
                  <>
                    {renderScoreBar(score.defenseScore ?? 0, "Điểm bảo vệ")}
                    <Divider />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" fontWeight={600}>
                        Tổng hội đồng:
                      </Typography>
                      <Chip
                        label={score.defenseScore}
                        color={getScoreColor(score.defenseScore ?? 0)}
                        size="small"
                      />
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có điểm bảo vệ
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Final Score Calculation */}
      {score.finalScore !== null && weightConfig && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Công thức tính điểm
          </Typography>
          <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              Điểm cuối = ({score.processScore || 0} × {weightConfig.supervisorWeight}) + ({score.reportScore || 0} × {weightConfig.reviewerWeight}) + ({score.defenseScore || 0} × {weightConfig.councilWeight}) = {score.finalScore}
            </Typography>
          </Paper>
        </Box>
      )}
    </Paper>
  );
}
