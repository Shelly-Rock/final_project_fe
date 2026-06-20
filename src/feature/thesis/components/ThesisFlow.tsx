"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Grid,
  LinearProgress,
  Divider,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { PageHeader } from "@/shared/components";
import {
  mockTopics,
  mockRegistrations,
  mockMilestones,
  mockWeeklyReports,
  mockScores,
} from "@/feature/thesis/constants";
import type { ThesisTopic, ThesisRegistration, Milestone, WeeklyReport } from "@/feature/thesis/types";

interface ThesisFlowProps {
  registration?: ThesisRegistration;
}

export function ThesisFlow({ registration }: ThesisFlowProps) {
  const [activeStep, setActiveStep] = useState(0);

  // Get data for current registration
  const registrationMilestones = registration
    ? mockMilestones.filter((m) => m.thesisId === registration.id)
    : [];

  const registrationReports = registration
    ? mockWeeklyReports.filter((r) => r.registrationId === registration.id)
    : [];

  // Calculate progress for each stage
  const stageProgress = {
    registration: registration ? 100 : 0,
    implementation: registrationMilestones.length > 0
      ? Math.round(
          (registrationMilestones.filter(
            (m) => m.status === "completed" || m.status === "approved"
          ).length /
            registrationMilestones.length) *
            100
        )
      : 0,
    evaluation: registration?.status === "in_progress" ? 50 : registration?.status === "completed" ? 100 : 0,
    defense: mockScores.find((s) => s.student === registration?.studentName)?.finalScore
      ? 100
      : 0,
  };

  const stages = [
    {
      label: "Giai đoạn A",
      title: "Khởi tạo & Đăng ký",
      description: "GV tạo đề tài → Thư ký duyệt → SV đăng ký → GV xác nhận",
      progress: stageProgress.registration,
      status: registration ? "completed" : "pending",
      details: [
        "GV tạo đề tài",
        "Thư ký duyệt đề tài",
        "SV đăng ký đề tài",
        "GV xác nhận đăng ký",
      ],
    },
    {
      label: "Giai đoạn B",
      title: "Thực hiện",
      description: "Gán Milestone/Task → SV nộp báo cáo → GV phản hồi",
      progress: stageProgress.implementation,
      status: stageProgress.implementation === 100 ? "completed" : stageProgress.implementation > 0 ? "active" : "pending",
      details: [
        "GV gán Milestone/Task",
        "SV nộp báo cáo tuần",
        "GV phản hồi đánh giá",
        "Cảnh báo trễ hạn (nếu có)",
      ],
    },
    {
      label: "Giai đoạn C",
      title: "Đánh giá trước bảo vệ",
      description: "GVHD chấm điểm → GV phản biện → Thư ký kiểm tra điều kiện",
      progress: stageProgress.evaluation,
      status: stageProgress.evaluation === 100 ? "completed" : stageProgress.evaluation > 0 ? "active" : "pending",
      details: [
        "GVHD chấm điểm quá trình (4 tiêu chí)",
        "GV phản biện độc lập",
        "Thư ký tổng hợp điều kiện",
        "Lên lịch bảo vệ",
      ],
    },
    {
      label: "Giai đoạn D",
      title: "Bảo vệ & Hoàn thành",
      description: "SV bảo vệ → Hội đồng chấm điểm → Tổng hợp điểm cuối",
      progress: stageProgress.defense,
      status: stageProgress.defense === 100 ? "completed" : stageProgress.defense > 0 ? "active" : "pending",
      details: [
        "SV trình bày trước hội đồng",
        "Hội đồng chấm điểm",
        "Tổng hợp điểm (GVHD + Phản biện + Hội đồng)",
        "Hoàn thành & Lưu hồ sơ",
      ],
    },
  ];

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Luồng xử lý khóa luận
        </Typography>
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {stages.map((stage, index) => (
            <Step key={index} completed={stage.progress === 100}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        stage.progress === 100
                          ? "success.main"
                          : stage.progress > 0
                            ? "primary.main"
                            : "grey.400",
                      color: "white",
                    }}
                  >
                    {stage.progress === 100 ? (
                      <CheckIcon />
                    ) : stage.progress > 0 ? (
                      <Typography variant="caption">{index + 1}</Typography>
                    ) : (
                      <UncheckedIcon />
                    )}
                  </Box>
                )}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {stage.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stage.label}
                  </Typography>
                </Box>
              </StepLabel>
              <StepContent>
                <Card variant="outlined" sx={{ ml: 4, mb: 2 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {stage.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Tiến độ
                        </Typography>
                        <Typography variant="caption" fontWeight={500}>
                          {stage.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={stage.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Stack spacing={1}>
                      {stage.details.map((detail, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {stage.progress === 100 ? (
                            <CheckIcon fontSize="small" color="success" />
                          ) : (
                            <UncheckedIcon fontSize="small" color="disabled" />
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              color: stage.progress === 100 ? "text.primary" : "text.secondary",
                            }}
                          >
                            {detail}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                {index === 0 && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ ml: 4 }}
                  >
                    Bắt đầu đăng ký
                  </Button>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Stage Actions */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thao tác nhanh
              </Typography>
              <Stack spacing={2}>
                <Button variant="outlined" fullWidth startIcon={<AddIcon />}>
                  Tạo đề tài mới
                </Button>
                <Button variant="outlined" fullWidth>
                  Xem danh sách đăng ký
                </Button>
                <Button variant="outlined" fullWidth>
                  Phê duyệt đề tài
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê nhanh
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Đề tài đã duyệt</Typography>
                  <Chip label={mockTopics.filter((t) => (t.registeredStudents?.length || 0) < t.maxStudents).length} size="small" />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Đăng ký chờ duyệt</Typography>
                  <Chip
                    label={mockRegistrations.filter((r) => r.status === "pending_supervisor").length}
                    size="small"
                    color="warning"
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Milestone trễ hạn</Typography>
                  <Chip
                    label={mockMilestones.filter((m) => m.status === "overdue").length}
                    size="small"
                    color="error"
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">SV đủ điều kiện BV</Typography>
                  <Chip
                    label={mockRegistrations.filter((r) => r.status === "in_progress").length}
                    size="small"
                    color="success"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
