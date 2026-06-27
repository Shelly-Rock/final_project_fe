"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Grid,
  Chip,
  Divider,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowForward as NextIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { PriorityDragList, type PriorityItem } from "@/shared/components/PriorityDragList";
import { DeadlineCountdownBanner } from "@/shared/components/DeadlineCountdownBanner";

const CONFIRMATION_DEADLINE = new Date("2026-07-20T23:59:59");

interface Application {
  id: string;
  topicId: string;
  topicName: string;
  lecturer: string;
  department: string;
  priority: number;
  status: "pending" | "confirmed" | "rejected";
}

const mockApplications: Application[] = [
  { id: "a1", topicId: "1", topicName: "Ứng dụng AI trong y tế", lecturer: "TS. Nguyễn Văn A", department: "CNTT", priority: 1, status: "pending" },
  { id: "a2", topicId: "4", topicName: "Xử lý ngôn ngữ tự nhiên cho tiếng Việt", lecturer: "TS. Phạm Thị D", department: "KHMT", priority: 2, status: "pending" },
  { id: "a3", topicId: "7", topicName: "Tối ưu hóa thuật toán tìm đường", lecturer: "TS. Nguyễn Văn A", department: "CNTT", priority: 3, status: "pending" },
];

export default function StudentApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [saved, setSaved] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const handleReorder = useCallback((items: PriorityItem[]) => {
    setApplications((prev) => {
      const idOrder = items.map((i) => i.id);
      return prev
        .map((a) => ({ ...a, priority: idOrder.indexOf(a.id) + 1 }))
        .sort((a, b) => a.priority - b.priority);
    });
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    setSnackbar({ open: true, message: "Đã lưu thứ tự ưu tiên!", severity: "success" });
  }, []);

  const handleConfirm = useCallback(() => {
    setConfirmDialog(false);
    setSnackbar({ open: true, message: "Đã xác nhận nguyện vọng! Chuyển đến trang xác nhận...", severity: "success" });
    setTimeout(() => router.push("/student/confirmation"), 1500);
  }, [router]);

  const dragItems: PriorityItem[] = applications.map((a) => ({
    id: a.id,
    label: a.topicName,
    sublabel: `${a.lecturer} • ${a.department}`,
    meta: { NV: a.priority },
  }));

  const now = new Date();
  const isExpired = now >= CONFIRMATION_DEADLINE;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Nguyện vọng của tôi
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sắp xếp thứ tự ưu tiên các đề tài đã đăng ký. NV1 = ưu tiên cao nhất.
        </Typography>
      </Box>

      {/* Deadline */}
      <Box sx={{ mb: 3, maxWidth: 500 }}>
        <DeadlineCountdownBanner deadline={CONFIRMATION_DEADLINE} />
      </Box>

      <Grid container spacing={3}>
        {/* Main: Drag list */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Thứ tự ưu tiên ({applications.length} đề tài)
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saved}
                >
                  {saved ? "Đã lưu!" : "Lưu"}
                </Button>
              </Box>

              {applications.length === 0 ? (
                <Alert severity="info">
                  <Typography variant="body2">
                    Bạn chưa đăng ký đề tài nào.{" "}
                    <Button size="small" onClick={() => router.push("/student/topics")}>
                      Đăng ký ngay
                    </Button>
                  </Typography>
                </Alert>
              ) : (
                <PriorityDragList
                  items={dragItems}
                  onReorder={handleReorder}
                  priorityLabel="Sắp xếp ưu tiên"
                  maxItems={3}
                  showIndex
                />
              )}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/student/topics")}
                >
                  Quay lại
                </Button>
                <Button
                  variant="contained"
                  endIcon={<NextIcon />}
                  onClick={() => setConfirmDialog(true)}
                  disabled={isExpired || applications.length === 0}
                >
                  Tiếp tục xác nhận
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar: Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Hướng dẫn
              </Typography>
              {[
                "Kéo thả hoặc dùng ▲▼ để sắp xếp",
                "NV1 = ưu tiên cao nhất",
                "NV2, NV3 = ưu tiên thấp hơn",
                "Nhấn Lưu sau khi thay đổi",
                "Xác nhận để hoàn tất đăng ký",
              ].map((tip, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1, mb: 0.75 }}>
                  <Chip label={i + 1} size="small" color="primary" sx={{ minWidth: 24, height: 20, fontSize: "0.65rem" }} />
                  <Typography variant="caption" color="text.secondary">{tip}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Alert severity="info" icon={<InfoIcon fontSize="small" />}>
            <Typography variant="caption">
              Sau khi xác nhận, bạn sẽ nhận được thông báo về đề tài được duyệt trong vòng 3-5 ngày làm việc.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Confirm dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận nguyện vọng</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Bạn đã sắp xếp <strong>{applications.length} đề tài</strong> theo thứ tự ưu tiên:
          </Typography>
          {applications
            .sort((a, b) => a.priority - b.priority)
            .map((app) => (
              <Box key={app.id} sx={{ mb: 1, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  NV{app.priority}: {app.topicName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {app.lecturer} • {app.department}
                </Typography>
              </Box>
            ))}
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="caption">
              Vui lòng kiểm tra kỹ thứ tự trước khi xác nhận. Sau khi xác nhận, thứ tự sẽ được gửi đến GVHD và Thư ký.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Quay lại sửa</Button>
          <Button variant="contained" onClick={handleConfirm}>
            Xác nhận & Tiếp tục
          </Button>
        </DialogActions>
      </Dialog>

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
