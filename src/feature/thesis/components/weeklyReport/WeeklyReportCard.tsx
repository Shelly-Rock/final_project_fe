"use client";

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Avatar,
  Stack,
  Divider,
  LinearProgress,
  Collapse,
  IconButton,
  Paper,
} from "@mui/material";
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  RateReview as FeedbackIcon,
} from "@mui/icons-material";
import { StatusBadge } from "@/feature/thesis/components/registration/RegistrationStatusBadge";
import { getWeekLabel } from "@/feature/thesis/constants";
import type { WeeklyReport } from "@/feature/thesis/types";

interface WeeklyReportCardProps {
  report: WeeklyReport;
  showDetails?: boolean;
  onView?: (report: WeeklyReport) => void;
  onGiveFeedback?: (report: WeeklyReport) => void;
}

export function WeeklyReportCard({
  report,
  showDetails = true,
  onView,
  onGiveFeedback,
}: WeeklyReportCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      sx={{
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 2,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {report.studentName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight={500}>
                {report.studentName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getWeekLabel(report.weekNumber, report.semester)}
              </Typography>
            </Box>
          </Box>
          <StatusBadge status={report.status} />
        </Box>

        {/* Self Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Tiến độ tự đánh giá
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {report.selfProgress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={report.selfProgress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                bgcolor:
                  report.selfProgress >= 80
                    ? "success.main"
                    : report.selfProgress >= 50
                      ? "warning.main"
                      : "error.main",
              },
            }}
          />
        </Box>

        {/* Collapsible Details */}
        {showDetails && (
          <>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ mb: 1 }}
            >
              {expanded ? <CollapseIcon /> : <ExpandIcon />}
            </IconButton>
            <Collapse in={expanded}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Công việc đã làm
                  </Typography>
                  <Typography variant="body2">{report.completedWork}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Vướng mắc
                  </Typography>
                  <Typography variant="body2">{report.obstacles}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Kế hoạch tuần sau
                  </Typography>
                  <Typography variant="body2">{report.nextWeekPlan}</Typography>
                </Box>

                {report.attachments && report.attachments.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                      File đính kèm
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {report.attachments.map((file, idx) => (
                        <Chip key={idx} label={file} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                )}

                {report.supervisorFeedback && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "primary.light",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary.dark" sx={{ mb: 0.5 }}>
                      Phản hồi của GV
                    </Typography>
                    <Typography variant="body2" color="primary.dark">
                      {report.supervisorFeedback}
                    </Typography>
                    {report.progressScore !== undefined && (
                      <Chip
                        label={`Điểm: ${report.progressScore}`}
                        size="small"
                        color={report.progressScore >= 8 ? "success" : report.progressScore >= 6 ? "warning" : "error"}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                )}

                {report.version > 1 && (
                  <Chip
                    label={`Phiên bản ${report.version}`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Collapse>
          </>
        )}
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Nộp: {report.submittedAt}
        </Typography>
        <Box>
          {onView && (
            <Button size="small" onClick={() => onView(report)}>
              Xem
            </Button>
          )}
          {(report.status === "submitted" || report.status === "waiting_feedback") && onGiveFeedback && (
            <Button
              size="small"
              variant="contained"
              startIcon={<FeedbackIcon />}
              onClick={() => onGiveFeedback(report)}
            >
              Phản hồi
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}

import { useState } from "react";
