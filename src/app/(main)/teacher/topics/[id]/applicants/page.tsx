"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { PriorityDragList, type PriorityItem } from "@/shared/components/PriorityDragList";

interface Applicant {
  id: string;
  name: string;
  mssv: string;
  priority: number;
  selected: boolean;
  email: string;
  group?: string;
}

interface TopicInfo {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  slots: number;
  registered: number;
}

const mockTopic: TopicInfo = {
  id: "1",
  code: "DT-001",
  name: "Ứng dụng AI trong y tế",
  lecturer: "TS. Nguyễn Văn A",
  slots: 3,
  registered: 2,
};

const mockApplicants: Applicant[] = [
  { id: "s1", name: "Nguyễn Văn Minh", mssv: "20210001", priority: 1, selected: false, email: "minhnv@example.com", group: "Nhóm 1" },
  { id: "s2", name: "Trần Thị Lan", mssv: "20210002", priority: 2, selected: false, email: "lantt@example.com", group: "Nhóm 2" },
  { id: "s3", name: "Lê Văn Hoàng", mssv: "20210003", priority: 3, selected: false, email: "hoanglv@example.com", group: "Nhóm 1" },
  { id: "s4", name: "Phạm Thị Mai", mssv: "20210004", priority: 4, selected: false, email: "maipt@example.com", group: "Nhóm 3" },
  { id: "s5", name: "Vũ Văn Long", mssv: "20210005", priority: 5, selected: false, email: "longvv@example.com" },
];

const priorityColors = ["success", "info", "warning", "default", "secondary", "error"];

export default function TeacherApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [dialog, setDialog] = useState<{ open: boolean; type: "confirm" | "reject" }>({
    open: false,
    type: "confirm",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const selectedCount = applicants.filter((a) => a.selected).length;
  const canConfirm = selectedCount > 0 && selectedCount <= mockTopic.slots;

  const handleToggleSelect = useCallback((id: string) => {
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, selected: !a.selected } : a
      )
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const allSelected = applicants.every((a) => a.selected);
    if (allSelected) {
      setApplicants((prev) => prev.map((a) => ({ ...a, selected: false })));
    } else {
      setApplicants((prev) => prev.map((a) => ({ ...a, selected: true })));
    }
  }, [applicants]);

  const handleReorder = useCallback((items: PriorityItem[]) => {
    setApplicants((prev) => {
      const idOrder = items.map((i) => i.id);
      return prev
        .map((a) => ({ ...a, priority: idOrder.indexOf(a.id) + 1 }))
        .sort((a, b) => a.priority - b.priority);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setDialog({ open: false, type: "confirm" });
    setSnackbar({
      open: true,
      message: `Đã xác nhận ${selectedCount} sinh viên cho đề tài!`,
      severity: "success",
    });
  }, [selectedCount]);

  const handleRejectAll = useCallback(() => {
    setDialog({ open: false, type: "reject" });
    setApplicants((prev) => prev.map((a) => ({ ...a, selected: false })));
    setSnackbar({ open: true, message: "Đã từ chối tất cả ứng viên!", severity: "success" });
  }, []);

  const dragListItems: PriorityItem[] = applicants.map((a) => ({
    id: a.id,
    label: a.name,
    sublabel: `${a.mssv} ${a.group ? `• ${a.group}` : ""}`,
    meta: { NV: a.priority },
  }));

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.push("/teacher/topics")}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Danh sách ứng viên
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mockTopic.code} — {mockTopic.name}
          </Typography>
        </Box>
        <Chip
          icon={<PeopleIcon />}
          label={`${selectedCount}/${mockTopic.slots} đã chọn`}
          color={selectedCount === mockTopic.slots ? "success" : "default"}
          variant="outlined"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Table */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Sinh viên đăng ký ({applicants.length})
                </Typography>
                <Button size="small" onClick={handleSelectAll}>
                  {applicants.every((a) => a.selected) ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.50" }}>
                      <TableCell padding="checkbox" />
                      <TableCell sx={{ fontWeight: 700 }}>STT NV</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Sinh viên</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>MSSV</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Nhóm</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applicants
                      .sort((a, b) => a.priority - b.priority)
                      .map((app, idx) => (
                        <TableRow
                          key={app.id}
                          sx={{
                            bgcolor: app.selected ? "action.selected" : undefined,
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              size="small"
                              checked={app.selected}
                              onChange={() => handleToggleSelect(app.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`#${app.priority}`}
                              size="small"
                              color={priorityColors[idx] as "success" | "info" | "warning" | "default"}
                              sx={{ fontWeight: 800 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: "0.7rem", bgcolor: `${priorityColors[idx]}.main` }}>
                                {app.name.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {app.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                              {app.mssv}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {app.group ? (
                              <Chip label={app.group} size="small" variant="outlined" />
                            ) : (
                              <Typography variant="caption" color="text.secondary">—</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Từ chối">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  setApplicants((prev) => prev.filter((a) => a.id !== app.id))
                                }
                              >
                                <RejectIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  disabled={!canConfirm}
                  onClick={() => setDialog({ open: true, type: "confirm" })}
                >
                  Xác nhận đăng ký ({selectedCount})
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={() => setDialog({ open: true, type: "reject" })}
                >
                  Từ chối tất cả
                </Button>
              </Box>

              {!canConfirm && selectedCount > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="caption">
                    Số lượng chọn ({selectedCount}) vượt quá số slot ({mockTopic.slots}). Vui lòng chọn lại.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Drag list */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <PriorityDragList
                items={dragListItems}
                onReorder={handleReorder}
                priorityLabel="Thứ tự nguyện vọng"
                maxItems={mockTopic.slots}
                showIndex
              />
            </CardContent>
          </Card>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              Kéo thả hoặc dùng nút ▲▼ để sắp xếp thứ tự ưu tiên. Sinh viên ưu tiên cao nhất (NV1) sẽ được xếp lịch trước.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, type: "confirm" })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialog.type === "confirm" ? "Xác nhận đăng ký" : "Từ chối tất cả"}
        </DialogTitle>
        <DialogContent>
          {dialog.type === "confirm" ? (
            <Typography variant="body2">
              Xác nhận <strong>{selectedCount} sinh viên</strong> cho đề tài "{mockTopic.name}"? Sinh viên sẽ nhận được thông báo và bắt đầu làm việc.
            </Typography>
          ) : (
            <Typography variant="body2">
              Từ chối tất cả ứng viên cho đề tài này? Họ sẽ nhận được thông báo và có thể chọn đề tài khác.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, type: "confirm" })}>Hủy</Button>
          <Button
            variant="contained"
            color={dialog.type === "confirm" ? "success" : "error"}
            onClick={dialog.type === "confirm" ? handleConfirm : handleRejectAll}
          >
            Xác nhận
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
