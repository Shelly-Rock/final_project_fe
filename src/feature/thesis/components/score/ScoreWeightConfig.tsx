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
  Stack,
  Slider,
  Paper,
  Chip,
} from "@mui/material";
import { mockScoreWeightConfigs } from "@/feature/thesis/constants";
import type { ScoreWeightConfig } from "@/feature/thesis/types";

interface ScoreWeightConfigFormProps {
  open: boolean;
  config?: ScoreWeightConfig;
  onClose: () => void;
  onSave: (config: ScoreWeightConfig) => void;
}

export function ScoreWeightConfigForm({
  open,
  config = mockScoreWeightConfigs[0],
  onClose,
  onSave,
}: ScoreWeightConfigFormProps) {
  const [formData, setFormData] = useState({
    supervisorWeight: (config?.supervisorWeight || 0.4) * 100,
    reviewerWeight: (config?.reviewerWeight || 0.2) * 100,
    councilWeight: (config?.councilWeight || 0.4) * 100,
    semester: config?.semester || "2023-2024-HK2",
  });

  const handleChange = (field: string, value: number | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const total = formData.supervisorWeight + formData.reviewerWeight + formData.councilWeight;
  const isValid = total === 100;

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      id: config?.id || `weight-${Date.now()}`,
      semester: formData.semester,
      supervisorWeight: formData.supervisorWeight / 100,
      reviewerWeight: formData.reviewerWeight / 100,
      councilWeight: formData.councilWeight / 100,
      createdBy: config?.createdBy || "admin",
      createdAt: config?.createdAt || new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cấu hình trọng số điểm</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Học kỳ/Đợt"
            value={formData.semester}
            onChange={(e) => handleChange("semester", e.target.value)}
            helperText="VD: 2023-2024-HK2"
          />

          <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
            <Typography variant="subtitle2" gutterBottom>
              Công thức tính điểm cuối cùng:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              Điểm cuối = (Điểm GVHD × {formData.supervisorWeight}%) + 
              (Điểm phản biện × {formData.reviewerWeight}%) + 
              (Điểm hội đồng × {formData.councilWeight}%)
            </Typography>
          </Paper>

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2">
                Trọng số GVHD: {formData.supervisorWeight}%
              </Typography>
            </Box>
            <Slider
              value={formData.supervisorWeight}
              onChange={(_, v) => handleChange("supervisorWeight", v as number)}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: "0%" },
                { value: 50, label: "50%" },
                { value: 100, label: "100%" },
              ]}
              sx={{
                "& .MuiSlider-track": { bgcolor: "primary.main" },
                "& .MuiSlider-rail": { bgcolor: "grey.300" },
              }}
            />
          </Box>

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2">
                Trọng số phản biện: {formData.reviewerWeight}%
              </Typography>
            </Box>
            <Slider
              value={formData.reviewerWeight}
              onChange={(_, v) => handleChange("reviewerWeight", v as number)}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: "0%" },
                { value: 50, label: "50%" },
                { value: 100, label: "100%" },
              ]}
              sx={{
                "& .MuiSlider-track": { bgcolor: "info.main" },
                "& .MuiSlider-rail": { bgcolor: "grey.300" },
              }}
            />
          </Box>

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2">
                Trọng số hội đồng: {formData.councilWeight}%
              </Typography>
            </Box>
            <Slider
              value={formData.councilWeight}
              onChange={(_, v) => handleChange("councilWeight", v as number)}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: "0%" },
                { value: 50, label: "50%" },
                { value: 100, label: "100%" },
              ]}
              sx={{
                "& .MuiSlider-track": { bgcolor: "success.main" },
                "& .MuiSlider-rail": { bgcolor: "grey.300" },
              }}
            />
          </Box>

          <Paper
            sx={{
              p: 2,
              bgcolor: isValid ? "success.light" : "error.light",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              Tổng trọng số:
            </Typography>
            <Chip
              label={`${total}%`}
              color={isValid ? "success" : "error"}
              variant="filled"
            />
          </Paper>

          {!isValid && (
            <Typography variant="body2" color="error">
              Tổng trọng số phải bằng 100%. Hiện tại: {total}%
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid}>
          Lưu cấu hình
        </Button>
      </DialogActions>
    </Dialog>
  );
}
