"use client";

import { useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid2";
import {
  TEACHER_PROPOSALS,
  ThesisProposalStatus,
  STATUS_COLORS,
} from "../data";
import { useBoolean, useDisclosure } from "@/shared/hooks";

const DEPARTMENTS = [
  "Công nghệ thông tin",
  "Kỹ thuật phần mềm",
  "Marketing",
  "IoT",
  "An toàn thông tin",
  "Khoa học dữ liệu",
];

const DEFAULT_FORM_DATA = {
  title: "",
  description: "",
  requirements: "",
  expectedOutcome: "",
  department: DEPARTMENTS[0],
  maxStudents: 2,
};

type ProposalFormData = typeof DEFAULT_FORM_DATA;

interface TeacherProposalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (proposal: ProposalFormData) => void;
}

export function TeacherProposalForm({
  open,
  onClose,
  onSubmit,
}: TeacherProposalFormProps) {
  const [formData, setFormData] = useState<ProposalFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { value: isSubmitting, setTrue: startSubmitting, setFalse: stopSubmitting } =
    useBoolean(false);

  const validate = useCallback((data: ProposalFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!data.title.trim()) newErrors.title = "Vui lòng nhập tên đề tài";
    if (!data.description.trim()) newErrors.description = "Vui lòng nhập mô tả";
    if (!data.requirements.trim()) newErrors.requirements = "Vui lòng nhập yêu cầu";
    if (!data.expectedOutcome.trim())
      newErrors.expectedOutcome = "Vui lòng nhập kết quả mong đợi";
    return newErrors;
  }, []);

  const handleSubmit = useCallback(() => {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    startSubmitting();
    onSubmit(formData);
    stopSubmitting();
    setFormData(DEFAULT_FORM_DATA);
    onClose();
  }, [formData, onSubmit, onClose, validate, startSubmitting, stopSubmitting]);

  const handleChange = useCallback(
    (field: keyof ProposalFormData, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <i className="bi bi-plus-circle-fill" style={{ color: "#1dab60" }} />
          Tạo đề tài mới
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Tên đề tài"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Mô tả đề tài"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                select
                label="Khoa"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
              >
                {DEPARTMENTS.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                type="number"
                label="Số sinh viên tối đa"
                value={formData.maxStudents}
                onChange={(e) =>
                  handleChange("maxStudents", parseInt(e.target.value))
                }
                inputProps={{ min: 1, max: 5 }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Yêu cầu công nghệ"
                value={formData.requirements}
                onChange={(e) => handleChange("requirements", e.target.value)}
                error={!!errors.requirements}
                helperText={
                  errors.requirements || "VD: React, Node.js, MongoDB"
                }
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Kết quả mong đợi"
                value={formData.expectedOutcome}
                onChange={(e) =>
                  handleChange("expectedOutcome", e.target.value)
                }
                error={!!errors.expectedOutcome}
                helperText={
                  errors.expectedOutcome ||
                  "VD: Hệ thống hoàn chỉnh triển khai thực tế"
                }
                required
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={<i className="bi bi-send" />}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi duyệt"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Teacher's submitted proposals list
interface TeacherProposalsListProps {
  onCreateNew: () => void;
}

export function TeacherProposalsList({
  onCreateNew,
}: TeacherProposalsListProps) {
  const getStatusColor = useCallback((status: ThesisProposalStatus) => {
    return STATUS_COLORS[status] ?? { bg: "#f3f4f6", color: "#6b7280" };
  }, []);

  return (
    <Card sx={{ p: 2, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          <i
            className="bi bi-journal-check"
            style={{ marginRight: 8, color: "#2a5bc0" }}
          />
          Đề tài đã gửi
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<i className="bi bi-plus-lg" />}
          onClick={onCreateNew}
        >
          Tạo đề tài mới
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {TEACHER_PROPOSALS.map((proposal) => {
          const colors = getStatusColor(proposal.status);
          return (
            <Box
              key={proposal.id}
              sx={{
                p: 2,
                bgcolor: "background.default",
                borderRadius: 1,
                borderLeft: `4px solid ${colors.color}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {proposal.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ngày gửi: {proposal.submittedAt}
                  </Typography>
                  {proposal.rejectionReason && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      <i className="bi bi-exclamation-circle" />{" "}
                      {proposal.rejectionReason}
                    </Typography>
                  )}
                </Box>
                <Chip
                  label={proposal.status}
                  size="small"
                  sx={{
                    bgcolor: colors.bg,
                    color: colors.color,
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
}
