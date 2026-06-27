"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Divider,
  Alert,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { StatusBadge } from "@/shared/components/StatusBadge";

interface ReviewData {
  id: string;
  code: string;
  name: string;
  description: string;
  lecturer: string;
  department: string;
  slots: number;
  registered: number;
  status: "open" | "locked" | "pending";
  allowStudentProposal: boolean;
  requirements: string;
  expectedOutcome: string;
  notes: string;
}

const mockTopic: ReviewData = {
  id: "3",
  code: "DT-003",
  name: "Blockchain trong quản lý chuỗi cung ứng",
  description: "Nghiên cứu và ứng dụng công nghệ blockchain để quản lý chuỗi cung ứng, đảm bảo tính minh bạch và truy xuất nguồn gốc.",
  lecturer: "PGS. Lê Văn C",
  department: "KHMT",
  slots: 4,
  registered: 4,
  status: "pending",
  allowStudentProposal: true,
  requirements: "Sinh viên có kiến thức về blockchain, smart contract, Python hoặc Solidity",
  expectedOutcome: "Hệ thống demo quản lý chuỗi cung ứng sử dụng blockchain, báo cáo kỹ thuật",
  notes: "Đề tài phù hợp với sinh viên có nền tảng về hệ thống phân tán",
};

const CHANGE_TYPES = [
  { value: "name", label: "Sửa tên đề tài" },
  { value: "description", label: "Sửa mô tả" },
  { value: "requirements", label: "Sửa yêu cầu" },
  { value: "slots", label: "Sửa số lượng SV tối đa" },
  { value: "reject", label: "Từ chối duyệt" },
];

export default function SecretaryReviewPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<ReviewData>(mockTopic);
  const [editMode, setEditMode] = useState(false);
  const [editedTopic, setEditedTopic] = useState(mockTopic);
  const [changeType, setChangeType] = useState("name");
  const [rejectReason, setRejectReason] = useState("");
  const [dialog, setDialog] = useState<{ open: boolean; type: "approve" | "reject" | "save" }>({
    open: false,
    type: "approve",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const handleApprove = useCallback(() => {
    // TODO: API call
    setDialog({ open: false, type: "approve" });
    setSnackbar({ open: true, message: "Duyệt đề tài thành công!", severity: "success" });
    setTimeout(() => router.push("/secretary/topics"), 1500);
  }, [router]);

  const handleReject = useCallback(() => {
    if (!rejectReason.trim()) {
      setSnackbar({ open: true, message: "Vui lòng nhập lý do từ chối!", severity: "error" });
      return;
    }
    // TODO: API call
    setDialog({ open: false, type: "reject" });
    setSnackbar({ open: true, message: "Từ chối đề tài thành công!", severity: "success" });
    setTimeout(() => router.push("/secretary/topics"), 1500);
  }, [rejectReason, router]);

  const handleSaveChanges = useCallback(() => {
    setTopic(editedTopic);
    setEditMode(false);
    setDialog({ open: false, type: "save" });
    setSnackbar({ open: true, message: "Lưu thay đổi thành công!", severity: "success" });
  }, [editedTopic]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.push("/secretary/topics")}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Duyệt đề tài
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mã: {topic.code} — GVHD: {topic.lecturer}
          </Typography>
        </Box>
        <StatusBadge status={topic.status} />
      </Box>

      <Grid container spacing={3}>
        {/* Topic details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Thông tin đề tài
                </Typography>
                {!editMode ? (
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                    variant="outlined"
                  >
                    Điều chỉnh
                  </Button>
                ) : (
                  <Button
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={() => setDialog({ open: true, type: "save" })}
                    variant="contained"
                  >
                    Lưu
                  </Button>
                )}
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Tên đề tài</Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editedTopic.name}
                      onChange={(e) => setEditedTopic((p) => ({ ...p, name: e.target.value }))}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{topic.name}</Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">Mô tả</Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      value={editedTopic.description}
                      onChange={(e) => setEditedTopic((p) => ({ ...p, description: e.target.value }))}
                    />
                  ) : (
                    <Typography variant="body2">{topic.description}</Typography>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Yêu cầu</Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        value={editedTopic.requirements}
                        onChange={(e) => setEditedTopic((p) => ({ ...p, requirements: e.target.value }))}
                      />
                    ) : (
                      <Typography variant="body2">{topic.requirements}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Kết quả dự kiến</Typography>
                    {editMode ? (
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        value={editedTopic.expectedOutcome}
                        onChange={(e) => setEditedTopic((p) => ({ ...p, expectedOutcome: e.target.value }))}
                      />
                    ) : (
                      <Typography variant="body2">{topic.expectedOutcome}</Typography>
                    )}
                  </Grid>
                </Grid>

                {editMode && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                      Loại thay đổi
                    </Typography>
                    <RadioGroup
                      value={changeType}
                      onChange={(e) => setChangeType(e.target.value)}
                      row
                    >
                      {CHANGE_TYPES.filter((c) => c.value !== "reject").map((c) => (
                        <FormControlLabel
                          key={c.value}
                          value={c.value}
                          control={<Radio size="small" />}
                          label={<Typography variant="body2">{c.label}</Typography>}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Thông tin nhanh
              </Typography>
              {[
                { label: "Khoa", value: topic.department },
                { label: "GVHD", value: topic.lecturer },
                { label: "Số SV đăng ký", value: `${topic.registered}/${topic.slots}` },
                { label: "Cho phép SV tự đề xuất", value: topic.allowStudentProposal ? "Có" : "Không" },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ mb: 1.5 }}>
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600}}>{value}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Reject reason */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Lý do từ chối (nếu có)
              </Typography>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                placeholder="Nhập lý do từ chối..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Hành động
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={() => setDialog({ open: true, type: "approve" })}
                  fullWidth
                >
                  Duyệt đề tài
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<EditIcon />}
                  onClick={() => setDialog({ open: true, type: "save" })}
                  fullWidth
                >
                  Điều chỉnh & Duyệt
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={() => setDialog({ open: true, type: "reject" })}
                  fullWidth
                  disabled={!rejectReason.trim() && false}
                >
                  Từ chối
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Alert severity="info">
                <Typography variant="caption">
                  Sau khi GV khoá đề tài, Thư ký sẽ duyệt lại nội dung trước khi công bố cho SV.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialog.type === "approve" && "Xác nhận duyệt đề tài"}
          {dialog.type === "reject" && "Xác nhận từ chối"}
          {dialog.type === "save" && "Xác nhận điều chỉnh & duyệt"}
        </DialogTitle>
        <DialogContent>
          {dialog.type === "approve" && (
            <Typography variant="body2">
              Bạn có chắc muốn <strong>duyệt</strong> đề tài "{topic.name}"?
            </Typography>
          )}
          {dialog.type === "reject" && (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Vui lòng xác nhận lý do từ chối:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Lý do từ chối..."
              />
            </>
          )}
          {dialog.type === "save" && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              <Typography variant="body2">
                Điều chỉnh nội dung và duyệt đề tài này. Thay đổi sẽ được lưu và thông báo cho GVHD.
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ ...dialog, open: false })}>Hủy</Button>
          <Button
            variant="contained"
            color={dialog.type === "reject" ? "error" : dialog.type === "approve" ? "success" : "primary"}
            onClick={() => {
              if (dialog.type === "approve") handleApprove();
              else if (dialog.type === "reject") handleReject();
              else handleSaveChanges();
            }}
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
