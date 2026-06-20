"use client";

import {
  Box,
  Typography,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { StatusBadge } from "@/feature/thesis/components/registration/RegistrationStatusBadge";
import type { Milestone } from "@/feature/thesis/types";

interface MilestoneProgressProps {
  milestones: Milestone[];
  activeStep?: number;
}

export function MilestoneProgress({
  milestones,
  activeStep = -1,
}: MilestoneProgressProps) {
  // Calculate stats
  const totalWeight = milestones.reduce((sum, m) => sum + m.weight, 0);
  const completedWeight = milestones
    .filter((m) => m.status === "completed" || m.status === "approved")
    .reduce((sum, m) => sum + m.weight, 0);
  const progress = Math.round((completedWeight / totalWeight) * 100);

  // Get active step index
  const currentStep = milestones.findIndex(
    (m) =>
      m.status === "in_progress" ||
      m.status === "submitted" ||
      m.status === "not_started"
  );

  // Check for overdue
  const hasOverdue = milestones.some((m) => m.status === "overdue");

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Tiến độ thực hiện</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {hasOverdue && (
            <Chip
              icon={<WarningIcon />}
              label="Có milestone trễ hạn"
              color="error"
              size="small"
            />
          )}
          <Typography variant="h4" color="primary">
            {progress}%
          </Typography>
        </Box>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 5,
          mb: 3,
          bgcolor: "grey.200",
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            bgcolor: hasOverdue ? "warning.main" : "primary.main",
          },
        }}
      />

      <Stepper
        orientation="vertical"
        activeStep={activeStep >= 0 ? activeStep : currentStep}
      >
        {milestones.map((milestone, index) => {
          const isCompleted =
            milestone.status === "completed" || milestone.status === "approved";
          const isOverdue = milestone.status === "overdue";
          const isActive = milestone.status === "in_progress";
          const isSubmitted = milestone.status === "submitted";

          return (
            <Step
              key={milestone.id}
              completed={isCompleted}
              sx={{
                "& .MuiStepLabel-root": {
                  cursor: "pointer",
                },
              }}
            >
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isCompleted
                        ? "success.main"
                        : isOverdue
                          ? "error.main"
                          : isActive
                            ? "primary.main"
                            : isSubmitted
                              ? "warning.main"
                              : "grey.400",
                      color: "white",
                    }}
                  >
                    {isCompleted ? (
                      <CheckIcon sx={{ fontSize: 16 }} />
                    ) : isOverdue ? (
                      <WarningIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {index + 1}
                      </Typography>
                    )}
                  </Box>
                )}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight={isActive || isCompleted ? 600 : 400}
                    sx={{
                      textDecoration: isCompleted ? "line-through" : "none",
                      color: isOverdue ? "error.main" : "inherit",
                    }}
                  >
                    {milestone.name}
                  </Typography>
                  <Chip
                    label={`${milestone.weight}%`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20 }}
                  />
                  <StatusBadge status={milestone.status} />
                </Box>
              </StepLabel>
              <StepContent>
                <Stack spacing={0.5} sx={{ ml: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {milestone.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hạn: {milestone.deadline}
                  </Typography>
                  {milestone.submittedAt && (
                    <Typography variant="caption" color="success.main">
                      Đã nộp: {milestone.submittedAt}
                    </Typography>
                  )}
                  {milestone.approvedAt && (
                    <Typography variant="caption" color="success.main">
                      Duyệt: {milestone.approvedAt}
                    </Typography>
                  )}
                  {milestone.revisionNote && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 1,
                        bgcolor: "warning.light",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" color="warning.dark">
                        {milestone.revisionNote}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Trọng số hoàn thành
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {completedWeight}/{totalWeight}%
        </Typography>
      </Box>
    </Paper>
  );
}
