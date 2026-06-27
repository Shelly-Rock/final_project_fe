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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Divider,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon,
  Description as DescIcon,
  Upload as UploadIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { ExtendOrChangeTopicModal } from "@/shared/components/ExtendOrChangeTopicModal";

type MonthStatus = "submitted" | "pending" | "missing" | "banned";

interface MonthProgress {
  month: number; // 1-12
  year: number;
  label: string;
  status: MonthStatus;
  submittedAt?: string;
  fileUrl?: string;
  note?: string;
  teacherComment?: string;
  teacherApproved?: boolean;
  banCount?: number; // consecutive missing months
}

interface StudentProgress {
  id: string;
  name: string;
  mssv: string;
  topic: string;
  progress: MonthProgress[];
  currentDeadline: string;
}

const BAN_THRESHOLD = 2; // consecutive missing months to ban
const TOTAL_MONTHS = 8; // months 1-8 of thesis

function generateMonths(): MonthProgress[] {
  const months: MonthProgress[] = [];
  for (let m = 1; m <= TOTAL_MONTHS; m++) {
    const status = Math.random() > 0.3
      ? "submitted" as MonthStatus
      : Math.random() > 0.5
      ? "pending" as MonthStatus
      : "missing" as MonthStatus;
    months.push({
      month: m,
      year: 2026,
      label: `Tháng ${m}`,
      status,
      submittedAt: status === "submitted" ? `2026-0${m}-15` : undefined,
      teacherComment: status === "submitted" ? "Đã kiểm tra, tiến độ đạt yêu cầu." : undefined,
      teacherApproved: status === "submitted" ? true : undefined,
    });
  }
  return months;
}

const mockStudents: StudentProgress[] = [
  {
    id: "s1",
    name: "Nguyễn Văn Minh",
    mssv: "20210001",
    topic: "Ứng dụng AI trong y tế",
    progress: generateMonths(),
    currentDeadline: "2026-11-15",
  },
  {
    id: "s2",
    name: "Trần Thị Lan",
    mssv: "20210002",
    topic: "Ứng dụng AI trong y tế",
    progress: generateMonths(),
    currentDeadline: "2026-11-15",
  },
];

const statusConfig: Record<MonthStatus, { label: string; color: "success" | "warning" | "error" | "default"; icon: React.ReactElement }> = {
  submitted: { label: "Đã nộp", color: "success", icon: <CheckCircleIcon fontSize="small" /> },
  pending: { label: "Chờ duyệt", color: "warning", icon: <TimeIcon fontSize="small" /> },
  missing: { label: "Chưa nộp", color: "error", icon: <WarningIcon fontSize="small" /> },
  banned: { label: "Cấm thi", color: "error", icon: <CancelIcon fontSize="small" /> },
};

export default function TeacherProgressPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [students] = useState<StudentProgress[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(mockStudents[0]);
  const [commentDialog, setCommentDialog] = useState<{ open: boolean; studentId: string; month: number }>({
    open: false,
    studentId: "",
    month: 0,
  });
  const [commentText, setCommentText] = useState("");
  const [extendModal, setExtendModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const handleApproveMonth = useCallback((studentId: string, month: number) => {
    setSnackbar({ open: true, message: `Đã duyệt tháng ${month}!`, severity: "success" });
  }, []);

  const handleRejectMonth = useCallback((studentId: string, month: number) => {
    setSnackbar({ open: true, message: `Đã từ chối tháng ${month}!`, severity: "success" });
  }, []);

  const handleOpenComment = useCallback((studentId: string, month: number) => {
    setCommentDialog({ open: true, studentId, month });
    setCommentText("");
  }, []);

  const handleSaveComment = useCallback(() => {
    setSnackbar({ open: true, message: "Đã lưu nhận xét!", severity: "success" });
    setCommentDialog({ open: false, studentId: "", month: 0 });
  }, []);

  const handleExtendSubmit = useCallback((choice: string, note?: string) => {
    setExtendModal(false);
    setSnackbar({ open: true, message: "Đã gửi yêu cầu gia hạn!", severity: "success" });
  }, []);

  const getBanCount = (progress: MonthProgress[]) => {
    let banCount = 0;
    for (const p of progress) {
      if (p.status === "missing") banCount++;
      else banCount = 0;
    }
    return banCount;
  };

  const getMonthStatus = (progress: MonthProgress[], month: number): MonthStatus => {
    const p = progress.find((m) => m.month === month);
    if (!p) return "pending";
    const banCount = getBanCount(progress.slice(0, progress.indexOf(p) + 1));
    if (banCount >= BAN_THRESHOLD) return "banned";
    return p.status;
  };

  const now = new Date();
  const currentMonth = now.getMonth() + 1;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.push("/teacher/topics")}>
          <BackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Tiến độ thực hiện
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Theo dõi và duyệt báo cáo tiến độ hàng tháng của SV
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<TimeIcon />}
          onClick={() => setExtendModal(true)}
        >
          Gia hạn / Đổi đề tài
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Student list */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Sinh viên ({students.length})
              </Typography>
              {students.map((student) => {
                const banCount = getBanCount(student.progress);
                const isBanned = banCount >= BAN_THRESHOLD;
                return (
                  <Box
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: selectedStudent?.id === student.id ? "primary.main" : "divider",
                      bgcolor: selectedStudent?.id === student.id ? "primary.50" : "transparent",
                      cursor: "pointer",
                      "&:hover": { borderColor: "primary.main" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: "0.7rem" }}>
                        {student.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {student.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {student.mssv}
                    </Typography>
                    {isBanned && (
                      <Chip
                        label="Cấm thi"
                        size="small"
                        color="error"
                        sx={{ mt: 0.5, fontSize: "0.6rem", height: 18 }}
                      />
                    )}
                    <LinearProgress
                      variant="determinate"
                      value={(student.progress.filter((p) => p.status === "submitted").length / TOTAL_MONTHS) * 100}
                      sx={{ mt: 1, height: 4, borderRadius: 2 }}
                      color={isBanned ? "error" : "primary"}
                    />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* Progress timeline */}
        <Grid item xs={12} md={9}>
          {selectedStudent ? (
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {selectedStudent.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedStudent.topic} • Hạn: {new Date(selectedStudent.currentDeadline).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Box>
                  {getBanCount(selectedStudent.progress) >= BAN_THRESHOLD && (
                    <Chip label="CẤM THI" color="error" sx={{ fontWeight: 900 }} />
                  )}
                </Box>

                {/* Banner cấm thi */}
                {getBanCount(selectedStudent.progress) >= BAN_THRESHOLD && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    icon={<WarningIcon />}
                    action={
                      <Button size="small" color="inherit" onClick={() => setExtendModal(true)}>
                        Xử lý gia hạn
                      </Button>
                    }
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Cảnh báo: Sinh viên đã không nộp báo cáo {BAN_THRESHOLD} tháng liên tiếp.
                      Theo quy định, SV có thể bị cấm thi.
                    </Typography>
                  </Alert>
                )}

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "primary.50" }}>
                        <TableCell sx={{ fontWeight: 700 }}>Tháng</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Ngày nộp</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>File</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Nhận xét GV</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedStudent.progress.map((p) => {
                        const cfg = statusConfig[p.status];
                        const isPast = p.month < currentMonth;
                        return (
                          <TableRow
                            key={p.month}
                            sx={{
                              opacity: isPast ? 1 : 0.7,
                              bgcolor: p.status === "banned" ? "error.50" : undefined,
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {p.label}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={cfg.icon}
                                label={cfg.label}
                                color={cfg.color}
                                size="small"
                                variant="filled"
                                sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption">
                                {p.submittedAt ?? "-"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {p.fileUrl ? (
                                <Chip
                                  icon={<DescIcon fontSize="small" />}
                                  label="Đã nộp"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              ) : (
                                <Typography variant="caption" color="error.main">—</Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ maxWidth: 200 }}>
                              {p.teacherComment ? (
                                <Tooltip title={p.teacherComment}>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      display: "block",
                                      maxWidth: 180,
                                    }}
                                  >
                                    {p.teacherComment}
                                  </Typography>
                                </Tooltip>
                              ) : (
                                <Typography variant="caption" color="text.secondary">Chưa có</Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {p.status === "submitted" && (
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <Tooltip title="Duyệt">
                                    <IconButton
                                      size="small"
                                      color="success"
                                      onClick={() => handleApproveMonth(selectedStudent.id, p.month)}
                                    >
                                      <ApproveIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Nhận xét">
                                    <IconButton
                                      size="small"
                                      color="warning"
                                      onClick={() => handleOpenComment(selectedStudent.id, p.month)}
                                    >
                                      <ArticleIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Từ chối">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleRejectMonth(selectedStudent.id, p.month)}
                                    >
                                      <RejectIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              )}
                              {p.status === "missing" && isPast && (
                                <Tooltip title="Gia hạn">
                                  <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={() => setExtendModal(true)}
                                  >
                                    <TimeIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider sx={{ my: 2 }} />

                <Alert severity="info">
                  <Typography variant="caption">
                    <strong>Quy định cấm thi:</strong> SV không nộp báo cáo {BAN_THRESHOLD} tháng liên tiếp sẽ bị cấm thi. Nhấn "Xử lý gia hạn" để gia hạn hoặc đổi đề tài.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info">Chọn sinh viên để xem tiến độ</Alert>
          )}
        </Grid>
      </Grid>

      {/* Comment dialog */}
      <Dialog open={commentDialog.open} onClose={() => setCommentDialog({ open: false, studentId: "", month: 0 })} maxWidth="sm" fullWidth>
        <DialogTitle>Nhận xét tháng {commentDialog.month}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Nhập nhận xét cho sinh viên về báo cáo tháng này..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialog({ open: false, studentId: "", month: 0 })}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveComment}>Lưu nhận xét</Button>
        </DialogActions>
      </Dialog>

      {/* Extend modal */}
      {selectedStudent && (
        <ExtendOrChangeTopicModal
          open={extendModal}
          onClose={() => setExtendModal(false)}
          topicName={selectedStudent.topic}
          studentName={selectedStudent.name}
          currentDeadline={selectedStudent.currentDeadline}
          onSubmit={handleExtendSubmit}
        />
      )}

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
