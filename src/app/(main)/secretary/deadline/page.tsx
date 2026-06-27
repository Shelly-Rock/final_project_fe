"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Paper,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Save as SaveIcon,
  Email as EmailIcon,
  Preview as PreviewIcon,
  Notifications as NotifIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";

interface AlertConfig {
  enabled: boolean;
  days: number[];
}

interface DeadlineConfig {
  registrationDeadline: string;
  proposalDeadline: string;
  submissionDeadline: string;
  defenseDeadline: string;
}

const EMAIL_TEMPLATES: Record<string, string> = {
  "7": `Kính gửi sinh viên,

Hệ thống thông báo: Còn 7 ngày nữa là đến hạn đăng ký đề tài luận văn.

Hạn chót: [NGÀY_HẠN_CHÓT]

Vui lòng đăng nhập hệ thống để hoàn tất thủ tục đăng ký.

Nếu bạn cần hỗ trợ, hãy liên hệ thư ký khoa.

Trân trọng,
[THƯ_KÝ]`,
  "3": `Cảnh báo: Chỉ còn 3 ngày!

Hạn đăng ký đề tài: [NGÀY_HẠN_CHÓT]

Hãy nhanh chóng hoàn tất đăng ký. Sau hạn chót, hệ thống sẽ tự động đóng.

[THƯ_KÝ]`,
  "1": `KHẨN CẤP: Chỉ còn 1 ngày!

Ngày mai là hạn chót đăng ký đề tài.

Hãy đăng nhập ngay: [LINK_HỆ_THỐNG]

[THƯ_KÝ]`,
};

const mockDeadlineConfig: DeadlineConfig = {
  registrationDeadline: "2026-07-15T23:59",
  proposalDeadline: "2026-07-30T23:59",
  submissionDeadline: "2026-11-15T23:59",
  defenseDeadline: "2026-12-10T23:59",
};

const mockAlertConfig: AlertConfig = {
  enabled: true,
  days: [7, 3, 1],
};

export default function SecretaryDeadlinePage() {
  const [deadline, setDeadline] = useState<DeadlineConfig>(mockDeadlineConfig);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>(mockAlertConfig);
  const [previewTemplate, setPreviewTemplate] = useState<string>("7");
  const [saved, setSaved] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "warning" });

  const handleSave = useCallback(() => {
    // TODO: API call to save deadline config
    setSaved(true);
    setSnackbar({ open: true, message: "Lưu cấu hình thành công!", severity: "success" });
    setTimeout(() => setSaved(false), 3000);
  }, []);

  const toggleAlertDay = useCallback((day: number) => {
    setAlertConfig((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day].sort((a, b) => b - a),
    }));
  }, []);

  const formatDeadline = (dt: string) => {
    const d = new Date(dt);
    return d.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ALERT_OPTIONS = [
    { day: 7, label: "7 ngày trước", color: "info" as const },
    { day: 3, label: "3 ngày trước", color: "warning" as const },
    { day: 1, label: "1 ngày trước", color: "error" as const },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Cấu hình Deadline & Thông báo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Thiết lập các mốc thời gian quan trọng và cấu hình thông báo tự động trước hạn.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Deadline config */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <CalendarIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Các mốc thời gian
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { key: "registrationDeadline", label: "Hạn đăng ký đề tài", note: "SV chọn và đăng ký đề tài" },
                  { key: "proposalDeadline", label: "Hạn nộp đề cương", note: "GVHD duyệt đề cương" },
                  { key: "submissionDeadline", label: "Hạn nộp luận văn", note: "SV nộp bài lên hệ thống" },
                  { key: "defenseDeadline", label: "Hạn bảo vệ", note: "Hội đồng chấm bảo vệ" },
                ].map(({ key, label, note }) => (
                  <Paper
                    key={key}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 1 }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {note}
                        </Typography>
                      </Box>
                      <TextField
                        type="datetime-local"
                        size="small"
                        value={deadline[key as keyof DeadlineConfig]}
                        onChange={(e) =>
                          setDeadline((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 220 }}
                      />
                    </Box>
                    {deadline[key as keyof DeadlineConfig] && (
                      <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: "block" }}>
                        {formatDeadline(deadline[key as keyof DeadlineConfig])}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saved}
              >
                {saved ? "Đã lưu!" : "Lưu cấu hình"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Alert config */}
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <NotifIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Cấu hình thông báo tự động
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={alertConfig.enabled}
                    onChange={(e) => setAlertConfig((prev) => ({ ...prev, enabled: e.target.checked }))}
                  />
                }
                label="Bật thông báo tự động"
                sx={{ mb: 2 }}
              />

              {alertConfig.enabled && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Gửi thông báo trước hạn:
                  </Typography>
                  {ALERT_OPTIONS.map(({ day, label, color }) => (
                    <Paper
                      key={day}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        cursor: "pointer",
                        borderColor: alertConfig.days.includes(day) ? `${color}.main` : "divider",
                        bgcolor: alertConfig.days.includes(day) ? `${color}.50` : "transparent",
                      }}
                      onClick={() => toggleAlertDay(day)}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={alertConfig.days.includes(day)}
                            onChange={() => toggleAlertDay(day)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Gửi email nhắc nhở {day} ngày trước hạn
                            </Typography>
                          </Box>
                        }
                        sx={{ m: 0 }}
                      />
                    </Paper>
                  ))}

                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      Email sẽ được gửi tự động đến tất cả sinh viên chưa hoàn tất đăng ký.
                    </Typography>
                  </Alert>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Email preview */}
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <EmailIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Preview Email Template
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                {ALERT_OPTIONS.map(({ day, label }) => (
                  <Chip
                    key={day}
                    label={label}
                    variant={previewTemplate === String(day) ? "filled" : "outlined"}
                    onClick={() => setPreviewTemplate(String(day))}
                    color={previewTemplate === String(day) ? "primary" : "default"}
                    size="small"
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  whiteSpace: "pre-wrap",
                  maxHeight: 300,
                  overflow: "auto",
                }}
              >
                {EMAIL_TEMPLATES[previewTemplate]?.replace(
                  "[NGÀY_HẠN_CHÓT]",
                  formatDeadline(deadline.registrationDeadline)
                ) ?? ""}
              </Paper>

              <Button
                size="small"
                variant="outlined"
                startIcon={<PreviewIcon />}
                sx={{ mt: 2 }}
                onClick={() => setPreviewTemplate(previewTemplate)}
              >
                Cập nhật preview
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar */}
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
