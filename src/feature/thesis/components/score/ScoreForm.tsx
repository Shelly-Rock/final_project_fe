"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import type { ThesisScore, SupervisorScore, ReviewerScore } from "@/feature/thesis/types";

interface ScoreFormProps {
  open: boolean;
  type: "supervisor" | "reviewer" | "council";
  score?: ThesisScore | SupervisorScore | ReviewerScore;
  onClose: () => void;
  onSubmit: (data: ScoreFormData) => void;
}

export interface ScoreFormData {
  // Supervisor criteria
  progressScore?: number;
  skillScore?: number;
  attitudeScore?: number;
  reportScore?: number;
  supervisorComment?: string;
  
  // Reviewer criteria
  contentScore?: number;
  methodologyScore?: number;
  resultScore?: number;
  presentationScore?: number;
  reviewerComment?: string;
  
  // Council criteria
  contentQuality?: number;
  methodology?: number;
  resultContribution?: number;
  qaPerformance?: number;
  councilComment?: string;
}

export function ScoreForm({
  open,
  type,
  score,
  onClose,
  onSubmit,
}: ScoreFormProps) {
  const [formData, setFormData] = useState<ScoreFormData>({
    supervisorComment: (score as SupervisorScore)?.supervisorComment || "",
    reviewerComment: (score as ReviewerScore)?.reviewerComment || "",
  });

  const handleChange = (field: keyof ScoreFormData, value: number | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTotal = (): number => {
    if (type === "supervisor") {
      const { progressScore = 0, skillScore = 0, attitudeScore = 0, reportScore = 0 } = formData;
      return ((progressScore + skillScore + attitudeScore + reportScore) / 4);
    }
    if (type === "reviewer") {
      const { contentScore = 0, methodologyScore = 0, resultScore = 0, presentationScore = 0 } = formData;
      return ((contentScore + methodologyScore + resultScore + presentationScore) / 4);
    }
    // Council
    const { contentQuality = 0, methodology = 0, resultContribution = 0, qaPerformance = 0 } = formData;
    return ((contentQuality + methodology + resultContribution + qaPerformance) / 4);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case "supervisor":
        return "Chấm điểm GVHD";
      case "reviewer":
        return "Chấm điểm phản biện";
      case "council":
        return "Chấm điểm hội đồng";
      default:
        return "Chấm điểm";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {type === "supervisor" && (
            <>
              <Typography variant="subtitle1" fontWeight={600}>
                Đánh giá 4 tiêu chí
              </Typography>
              
              <Box>
                <Typography variant="body2" gutterBottom>
                  Tiến độ thực hiện: {formData.progressScore || 0}
                </Typography>
                <Slider
                  value={formData.progressScore || 0}
                  onChange={(_, v) => handleChange("progressScore", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                  ]}
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Kỹ năng/Kỹ thuật: {formData.skillScore || 0}
                </Typography>
                <Slider
                  value={formData.skillScore || 0}
                  onChange={(_, v) => handleChange("skillScore", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                  ]}
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Tinh thần/Thái độ: {formData.attitudeScore || 0}
                </Typography>
                <Slider
                  value={formData.attitudeScore || 0}
                  onChange={(_, v) => handleChange("attitudeScore", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                  ]}
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Chất lượng báo cáo: {formData.reportScore || 0}
                </Typography>
                <Slider
                  value={formData.reportScore || 0}
                  onChange={(_, v) => handleChange("reportScore", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                  ]}
                />
              </Box>

              <Divider />

              <TextField
                label="Nhận xét"
                multiline
                rows={3}
                value={formData.supervisorComment || ""}
                onChange={(e) => handleChange("supervisorComment", e.target.value)}
                placeholder="Nhập nhận xét về quá trình thực hiện của sinh viên..."
              />
            </>
          )}

          {type === "reviewer" && (
            <>
              <Typography variant="subtitle1" fontWeight={600}>
                Đánh giá phản biện
              </Typography>
              
              <Box>
                <Typography variant="body2" gutterBottom>
                  Nội dung: {formData.contentScore || 0}
                </Typography>
                <Slider
                  value={formData.contentScore || 0}
                  onChange={(_, v) => handleChange("contentScore", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                  ]}
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Phương pháp nghiên cứu: {formData.methodologyScore || 0}
                </Typography>
                <Slider
                  value={formData.methodologyScore || 0}
                  onChange={(_, v) => handleChange("methodologyScore", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                  ]}
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Kết quả đạt được: {formData.resultScore || 0}
                </Typography>
                <Slider
                  value={formData.resultScore || 0}
                  onChange={(_, v) => handleChange("resultScore", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                  ]}
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Trình bày: {formData.presentationScore || 0}
                </Typography>
                <Slider
                  value={formData.presentationScore || 0}
                  onChange={(_, v) => handleChange("presentationScore", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                  ]}
                />
              </Box>

              <Divider />

              <TextField
                label="Nhận xét phản biện"
                multiline
                rows={3}
                value={formData.reviewerComment || ""}
                onChange={(e) => handleChange("reviewerComment", e.target.value)}
                placeholder="Nhập nhận xét về báo cáo và sản phẩm của sinh viên..."
              />
            </>
          )}

          {type === "council" && (
            <>
              <Typography variant="subtitle1" fontWeight={600}>
                Đánh giá của hội đồng
              </Typography>
              
              <Box>
                <Typography variant="body2" gutterBottom>
                  Chất lượng nội dung: {formData.contentQuality || 0}
                </Typography>
                <Slider
                  value={formData.contentQuality || 0}
                  onChange={(_, v) => handleChange("contentQuality", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Phương pháp: {formData.methodology || 0}
                </Typography>
                <Slider
                  value={formData.methodology || 0}
                  onChange={(_, v) => handleChange("methodology", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Đóng góp kết quả: {formData.resultContribution || 0}
                </Typography>
                <Slider
                  value={formData.resultContribution || 0}
                  onChange={(_, v) => handleChange("resultContribution", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Trả lời câu hỏi: {formData.qaPerformance || 0}
                </Typography>
                <Slider
                  value={formData.qaPerformance || 0}
                  onChange={(_, v) => handleChange("qaPerformance", v as number)}
                  min={0}
                  max={10}
                  step={0.5}
                />
              </Box>

              <Divider />

              <TextField
                label="Nhận xét của hội đồng"
                multiline
                rows={3}
                value={formData.councilComment || ""}
                onChange={(e) => handleChange("councilComment", e.target.value)}
              />
            </>
          )}

          <Alert severity="info">
            Tổng điểm: <strong>{calculateTotal().toFixed(2)}</strong>
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Lưu điểm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { useState } from "react";
