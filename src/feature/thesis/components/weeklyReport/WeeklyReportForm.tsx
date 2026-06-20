"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Slider,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
} from "@mui/material";
import type { WeeklyReport } from "@/feature/thesis/types";

interface WeeklyReportFormProps {
  open: boolean;
  report?: WeeklyReport;
  onClose: () => void;
  onSubmit: (data: WeeklyReportFormData) => void;
}

export interface WeeklyReportFormData {
  completedWork: string;
  obstacles: string;
  nextWeekPlan: string;
  selfProgress: number;
  attachments?: string[];
}

export function WeeklyReportForm({
  open,
  report,
  onClose,
  onSubmit,
}: WeeklyReportFormProps) {
  const [formData, setFormData] = useState<WeeklyReportFormData>({
    completedWork: report?.completedWork || "",
    obstacles: report?.obstacles || "",
    nextWeekPlan: report?.nextWeekPlan || "",
    selfProgress: report?.selfProgress || 0,
    attachments: report?.attachments || [],
  });

  const [feedback, setFeedback] = useState({
    feedback: report?.supervisorFeedback || "",
    progressScore: report?.progressScore || 8,
  });

  const isEditing = Boolean(report);

  const handleSubmit = () => {
    if (isEditing) {
      // Supervisor feedback
      onSubmit({
        ...formData,
      } as WeeklyReportFormData & { supervisorFeedback: string; score: number });
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  const handleChange = (
    field: keyof WeeklyReportFormData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing
          ? `Phản hồi báo cáo tuần - ${report?.studentName}`
          : "Tạo báo cáo tuần mới"}
      </DialogTitle>
      <DialogContent>
        {isEditing ? (
          // Supervisor Feedback Form
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Original Report Info */}
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Báo cáo của sinh viên
              </Typography>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Công việc đã làm
                  </Typography>
                  <Typography variant="body2">{report?.completedWork}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Vướng mắc
                  </Typography>
                  <Typography variant="body2">{report?.obstacles}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Kế hoạch tuần sau
                  </Typography>
                  <Typography variant="body2">{report?.nextWeekPlan}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Tiến độ tự đánh giá:
                  </Typography>
                  <Chip label={`${report?.selfProgress}%`} size="small" />
                </Box>
              </Stack>
            </Paper>

            {/* Feedback Input */}
            <TextField
              label="Phản hồi"
              multiline
              rows={4}
              value={feedback.feedback}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, feedback: e.target.value }))
              }
              placeholder="Nhập phản hồi cho sinh viên..."
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Điểm tiến độ (0-10)
              </Typography>
              <Slider
                value={feedback.progressScore}
                onChange={(_, value) =>
                  setFeedback((prev) => ({ ...prev, progressScore: value as number }))
                }
                min={0}
                max={10}
                step={0.5}
                marks={[
                  { value: 0, label: "0" },
                  { value: 5, label: "5" },
                  { value: 10, label: "10" },
                ]}
                valueLabelDisplay="on"
              />
            </Box>

            <Alert severity="info">
              Báo cáo sẽ được chuyển sang trạng thái "Đã duyệt" sau khi bạn gửi phản hồi.
            </Alert>
          </Stack>
        ) : (
          // Student Report Form
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Công việc đã làm trong tuần"
              multiline
              rows={3}
              value={formData.completedWork}
              onChange={(e) => handleChange("completedWork", e.target.value)}
              placeholder="Mô tả chi tiết công việc đã hoàn thành..."
              required
            />

            <TextField
              label="Vướng mắc gặp phải"
              multiline
              rows={2}
              value={formData.obstacles}
              onChange={(e) => handleChange("obstacles", e.target.value)}
              placeholder="Liệt kê các khó khăn, vấn đề gặp phải..."
            />

            <TextField
              label="Kế hoạch tuần sau"
              multiline
              rows={2}
              value={formData.nextWeekPlan}
              onChange={(e) => handleChange("nextWeekPlan", e.target.value)}
              placeholder="Mô tả công việc dự kiến thực hiện tuần tới..."
              required
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Tiến độ tự đánh giá (0-100%)
              </Typography>
              <Slider
                value={formData.selfProgress}
                onChange={(_, value) => handleChange("selfProgress", value as number)}
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: "0%" },
                  { value: 50, label: "50%" },
                  { value: 100, label: "100%" },
                ]}
                valueLabelDisplay="on"
              />
              <Typography variant="caption" color="text.secondary">
                Đánh giá mức độ hoàn thành của bạn cho đến hiện tại
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !isEditing &&
            (!formData.completedWork || !formData.nextWeekPlan)
          }
        >
          {isEditing ? "Gửi phản hồi" : "Nộp báo cáo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
