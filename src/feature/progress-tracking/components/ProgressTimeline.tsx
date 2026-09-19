import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Link,
  type ChipProps,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  CheckCircle,
  Warning,
  Schedule,
  AssignmentTurnedIn,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { progressTrackingService } from "../services";
import type { TimelineNode, ReportStatus } from "../types";
import dayjs from "dayjs";

interface ProgressTimelineProps {
  studentId?: number;
  isTeacherView?: boolean;
  onUploadClick?: (deadlineId: number, label: string) => void;
  onReviewClick?: (reportId: number) => void;
}

const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case "APPROVED_BY_TEACHER":
    case "APPROVED":
      return "success";
    case "REVISION_REQUESTED":
    case "REJECTED":
      return "error";
    case "PENDING_TEACHER":
    case "PENDING":
      return "warning";
    default:
      return "default";
  }
};

const getStatusLabel = (status: ReportStatus) => {
  switch (status) {
    case "APPROVED_BY_TEACHER":
    case "APPROVED":
      return "Đã duyệt";
    case "REVISION_REQUESTED":
    case "REJECTED":
      return "Yêu cầu sửa";
    case "PENDING_TEACHER":
    case "PENDING":
      return "Chờ duyệt";
    case "MISSING":
      return "Thiếu báo cáo";
    default:
      return status;
  }
};

export function ProgressTimeline({
  studentId,
  isTeacherView,
  onUploadClick,
  onReviewClick,
}: ProgressTimelineProps) {
  const [timeline, setTimeline] = useState<TimelineNode[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTimeline = useCallback(async () => {
    setLoading(true);
    try {
      const data = await progressTrackingService.getTimeline({ studentId });
      setTimeline(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (timeline.length === 0)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          Chưa có tiến trình nào được cấu hình cho đợt này.
        </Typography>
      </Box>
    );

  const now = dayjs();
  let activeStep = timeline.findIndex((node) =>
    dayjs(node.deadlineAt).isAfter(now),
  );
  if (activeStep === -1) activeStep = timeline.length;

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {timeline.map((node, index) => {
          const isPast = dayjs(node.deadlineAt).isBefore(now);
          const prevNode = index > 0 ? timeline[index - 1] : null;
          const isFuture = prevNode
            ? dayjs(now).isBefore(dayjs(prevNode.deadlineAt))
            : false;

          // Only PERIODIC_REPORT needs an explicit student submission
          const isSubmittable = node.type === "PERIODIC_REPORT";

          return (
            <Step key={node.id} expanded={true}>
              <StepLabel
                optional={
                  <Typography
                    variant="caption"
                    color={
                      isPast && !node.submission && isSubmittable
                        ? "error"
                        : "text.secondary"
                    }
                  >
                    Hạn chót:{" "}
                    {dayjs(node.deadlineAt).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                }
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {node.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, mb: 2, bgcolor: "background.default" }}
                >
                  {node.template && (
                    <Box
                      sx={{
                        mb: 2,
                        p: 1.5,
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        Biểu mẫu yêu cầu:
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Button
                          component="a"
                          href={
                            node.template.fileUrl.includes("cloudinary.com")
                              ? node.template.fileUrl.replace(
                                  "/upload/",
                                  `/upload/fl_attachment:${encodeURIComponent(node.template.fileName.substring(0, node.template.fileName.lastIndexOf(".")) || node.template.fileName)}/`,
                                )
                              : node.template.fileUrl
                          }
                          target="_blank"
                          rel="noopener"
                          download={node.template.fileName}
                          variant="text"
                          size="small"
                          startIcon={<DescriptionIcon />}
                          endIcon={<DownloadIcon />}
                          sx={{
                            textTransform: "none",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          {node.template.name}
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {!isSubmittable ? (
                    <Typography variant="body2" color="text.secondary">
                      {node.type === "FINAL_SUBMISSION"
                        ? "Sinh viên trưởng nhóm nộp báo cáo tổng ở giao diện Nộp bài cuối kỳ."
                        : "Giai đoạn cấu hình / thủ tục, không yêu cầu nộp báo cáo cá nhân."}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        Tình trạng nộp bài:
                      </Typography>
                      {node.submission ? (
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <CheckCircle color="success" fontSize="small" />
                            <Chip
                              size="small"
                              color={
                                getStatusColor(
                                  node.submission.status,
                                ) as ChipProps["color"]
                              }
                              label={getStatusLabel(node.submission.status)}
                            />
                            <Typography variant="body2">
                              Nộp lúc:{" "}
                              {dayjs(node.submission.submittedAt).format(
                                "DD/MM/YYYY HH:mm",
                              )}
                            </Typography>
                          </Box>
                          {node.submission.fileUrl && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Link
                                href={node.submission.fileUrl}
                                target="_blank"
                                rel="noopener"
                                underline="hover"
                                variant="body2"
                              >
                                Tải file bài nộp
                              </Link>
                            </Box>
                          )}
                          {node.submission.feedback && (
                            <Paper
                              sx={{
                                p: 1.5,
                                mt: 1,
                                bgcolor: "warning.light",
                                color: "warning.contrastText",
                              }}
                            >
                              <Typography variant="caption" fontWeight={600}>
                                Nhận xét của GV:
                              </Typography>
                              <Typography variant="body2">
                                {node.submission.feedback}
                              </Typography>
                            </Paper>
                          )}

                          {isTeacherView && onReviewClick && (
                            <Button
                              size="small"
                              variant="contained"
                              sx={{ mt: 1 }}
                              onClick={() => onReviewClick(node.submission!.id)}
                            >
                              Đánh giá / Nhận xét
                            </Button>
                          )}
                          {!isTeacherView && onUploadClick && !isPast && (
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ mt: 1 }}
                              onClick={() => onUploadClick(node.id, node.label)}
                            >
                              Cập nhật bài nộp
                            </Button>
                          )}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: isPast
                              ? "error.lighter"
                              : "background.paper",
                            borderRadius: 1,
                            border: "1px dashed",
                            borderColor: isPast ? "error.main" : "divider",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            {isPast ? (
                              <Warning color="error" fontSize="small" />
                            ) : isFuture ? (
                              <Schedule color="disabled" fontSize="small" />
                            ) : (
                              <AssignmentTurnedIn
                                color="action"
                                fontSize="small"
                              />
                            )}
                            <Typography
                              variant="body2"
                              color={isPast ? "error.main" : "text.secondary"}
                            >
                              {isPast
                                ? "Đã trễ hạn nộp bài!"
                                : isFuture
                                  ? "Chưa đến thời gian nộp bài."
                                  : "Chưa nộp bài."}
                            </Typography>
                          </Box>
                          {!isTeacherView &&
                            onUploadClick &&
                            !isPast &&
                            !isFuture && (
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<UploadIcon />}
                                onClick={() =>
                                  onUploadClick(node.id, node.label)
                                }
                              >
                                Nộp bài ngay
                              </Button>
                            )}
                        </Box>
                      )}
                    </>
                  )}
                </Paper>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
