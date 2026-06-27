"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Snackbar,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

const DEPARTMENTS = ["CNTT", "KHMT", "KTPM", "HTTT", "ATTT", "MMT&TT"];

interface ProposalForm {
  name: string;
  description: string;
  requirements: string;
  expectedOutcome: string;
  department: string;
  slots: number;
  allowStudentProposal: boolean;
  maxStudentProposals: number;
  deadline: string;
}

const DEFAULT_FORM: ProposalForm = {
  name: "",
  description: "",
  requirements: "",
  expectedOutcome: "",
  department: "",
  slots: 3,
  allowStudentProposal: false,
  maxStudentProposals: 3,
  deadline: "",
};

export default function TeacherNewTopicPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProposalForm>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const set = (field: keyof ProposalForm, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = useCallback(async () => {
    if (!form.name.trim() || !form.department) {
      setSnackbar({ open: true, message: "Vui lòng điền đầy đủ thông tin bắt buộc!", severity: "error" });
      return;
    }
    setSaving(true);
    // TODO: API call
    await new Promise((r) => setTimeout(r, 1500));
    setSaving(false);
    setSnackbar({ open: true, message: "Tạo đề tài thành công!", severity: "success" });
    setTimeout(() => router.push("/teacher/topics"), 1500);
  }, [form, router]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Tạo đề tài mới
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Điền thông tin chi tiết đề tài luận văn. Sau khi tạo, đề tài sẽ được gửi đến Thư ký để duyệt.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Thông tin đề tài
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Tên đề tài"
                  fullWidth
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="VD: Ứng dụng AI trong y tế"
                  inputProps={{ maxLength: 200 }}
                  helperText={`${form.name.length}/200 ký tự`}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel>Khoa</InputLabel>
                      <Select
                        label="Khoa"
                        value={form.department}
                        onChange={(e) => set("department", e.target.value)}
                      >
                        {DEPARTMENTS.map((d) => (
                          <MenuItem key={d} value={d}>{d}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Số SV tối đa"
                      type="number"
                      fullWidth
                      size="small"
                      value={form.slots}
                      onChange={(e) => set("slots", Math.max(1, Number(e.target.value)))}
                      inputProps={{ min: 1, max: 10 }}
                      helperText="Số lượng sinh viên tối đa có thể đăng ký"
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Mô tả đề tài"
                  fullWidth
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Mô tả chi tiết về nội dung, phạm vi nghiên cứu của đề tài..."
                  inputProps={{ maxLength: 2000 }}
                  helperText={`${form.description.length}/2000 ký tự`}
                />

                <TextField
                  label="Yêu cầu đối với sinh viên"
                  fullWidth
                  multiline
                  rows={2}
                  value={form.requirements}
                  onChange={(e) => set("requirements", e.target.value)}
                  placeholder="VD: Sinh viên cần có kiến thức về Python, Machine Learning..."
                />

                <TextField
                  label="Kết quả dự kiến"
                  fullWidth
                  multiline
                  rows={2}
                  value={form.expectedOutcome}
                  onChange={(e) => set("expectedOutcome", e.target.value)}
                  placeholder="VD: Hệ thống demo, báo cáo kỹ thuật, bài báo..."
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar: Options */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Tùy chọn
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.allowStudentProposal}
                      onChange={(e) => set("allowStudentProposal", e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Cho phép SV tự đề xuất
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sinh viên có thể đề xuất hướng nghiên cứu mới dựa trên đề tài này
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: "flex-start", m: 0 }}
                />

                {form.allowStudentProposal && (
                  <TextField
                    label="Giới hạn nguyện vọng"
                    type="number"
                    size="small"
                    fullWidth
                    value={form.maxStudentProposals}
                    onChange={(e) => set("maxStudentProposals", Math.max(1, Number(e.target.value)))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">/ SV</InputAdornment>,
                    }}
                    helperText="Số nguyện vọng tối đa mỗi sinh viên được đề xuất cho đề tài này"
                  />
                )}

                <TextField
                  label="Hạn đăng ký"
                  type="datetime-local"
                  fullWidth
                  size="small"
                  value={form.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Alert severity="info">
                <Typography variant="caption">
                  Đề tài sẽ ở trạng thái <strong>Chờ duyệt</strong> cho đến khi Thư ký xác nhận.
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={saving}
                  fullWidth
                >
                  {saving ? "Đang lưu..." : "Tạo đề tài"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/teacher/topics")}
                  fullWidth
                >
                  Hủy bỏ
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
