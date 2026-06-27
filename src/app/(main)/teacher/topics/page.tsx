"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  People as PeopleIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { TopicCard } from "@/shared/components/TopicCard";
import { DeadlineCountdownBanner } from "@/shared/components/DeadlineCountdownBanner";
import type { TopicCardTopic, TopicCardStatus } from "@/shared/components/TopicCard";

interface TeacherTopic extends TopicCardTopic {
  allowStudentProposal: boolean;
  maxStudentProposals: number;
}

const mockTeacherTopics: TeacherTopic[] = [
  {
    id: "1",
    name: "Ứng dụng AI trong y tế",
    description: "Nghiên cứu ứng dụng AI để chẩn đoán bệnh, phân tích hình ảnh y khoa.",
    department: "CNTT",
    lecturer: "TS. Nguyễn Văn A",
    slots: 3,
    registered: 2,
    status: "open",
    allowStudentProposal: true,
    maxStudentProposals: 3,
    applicants: [
      { id: "s1", name: "Nguyễn Văn X", priority: 1 },
      { id: "s2", name: "Trần Thị Y", priority: 2 },
    ],
  },
  {
    id: "2",
    name: "Hệ thống IoT cho nông nghiệp thông minh",
    description: "Xây dựng hệ thống giám sát và điều khiển tưới tiêu tự động.",
    department: "CNTT",
    lecturer: "TS. Nguyễn Văn A",
    slots: 2,
    registered: 2,
    status: "locked",
    allowStudentProposal: false,
    maxStudentProposals: 3,
    applicants: [
      { id: "s3", name: "Lê Văn Z", priority: 1 },
    ],
  },
  {
    id: "3",
    name: "Blockchain trong quản lý chuỗi cung ứng",
    description: "Nghiên cứu ứng dụng blockchain trong quản lý chuỗi cung ứng.",
    department: "KHMT",
    lecturer: "TS. Nguyễn Văn A",
    slots: 4,
    registered: 1,
    status: "pending",
    allowStudentProposal: false,
    maxStudentProposals: 3,
    applicants: [],
  },
];

const REGISTRATION_DEADLINE = new Date("2026-07-15T23:59:59");

export default function TeacherTopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<TeacherTopic[]>(mockTeacherTopics);
  const [lockDialog, setLockDialog] = useState<{ open: boolean; topicId: string | null; action: "lock" | "unlock" }>({
    open: false,
    topicId: null,
    action: "lock",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const handleLockToggle = useCallback((topicId: string, currentStatus: TopicCardStatus) => {
    const newStatus: TopicCardStatus = currentStatus === "locked" ? "open" : "locked";
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, status: newStatus } : t))
    );
    setLockDialog({ open: false, topicId: null, action: "lock" });
    setSnackbar({
      open: true,
      message: newStatus === "locked" ? "Đã khóa đề tài!" : "Đã mở khóa đề tài!",
      severity: "success",
    });
  }, []);

  const openLockDialog = useCallback((topicId: string, action: "lock" | "unlock") => {
    setLockDialog({ open: true, topicId, action });
  }, []);

  const now = new Date();
  const isAfterDeadline = now >= REGISTRATION_DEADLINE;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Đề tài của tôi
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý các đề tài luận văn đã tạo. Chỉ có thể khóa đề tài sau hạn đăng ký.
        </Typography>
      </Box>

      {/* Deadline banner */}
      <Box sx={{ mb: 3, maxWidth: 500 }}>
        <DeadlineCountdownBanner
          deadline={REGISTRATION_DEADLINE}
          onExpired={() => setSnackbar({ open: true, message: "Hạn đăng ký đã kết thúc!", severity: "warning" })}
        />
      </Box>

      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Tổng đề tài", value: topics.length, color: "primary.main" },
          { label: "Đang mở", value: topics.filter((t) => t.status === "open").length, color: "success.main" },
          { label: "Đã khóa", value: topics.filter((t) => t.status === "locked").length, color: "error.main" },
          { label: "Chờ duyệt", value: topics.filter((t) => t.status === "pending").length, color: "warning.main" },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!isAfterDeadline && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Chỉ có thể khóa đề tài sau khi hết hạn đăng ký ({REGISTRATION_DEADLINE.toLocaleDateString("vi-VN")}).
          </Typography>
        </Alert>
      )}

      {/* Topics */}
      <Grid container spacing={3}>
        {topics.map((topic) => (
          <Grid item xs={12} md={6} lg={4} key={topic.id}>
            <TopicCard
              topic={topic}
              canLock={isAfterDeadline}
              onLock={() => openLockDialog(topic.id, topic.status === "locked" ? "unlock" : "lock")}
              onViewDetail={() => router.push(`/teacher/topics/${topic.id}/applicants`)}
            />
          </Grid>
        ))}

        {/* Add new */}
        <Grid item xs={12} md={6} lg={4}>
          <Card
            sx={{
              height: "100%",
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
            }}
            onClick={() => router.push("/teacher/topics/new")}
          >
            <Box sx={{ textAlign: "center" }}>
              <AddIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Tạo đề tài mới
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Thêm đề tài luận văn mới
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Lock confirmation dialog */}
      <Dialog
        open={lockDialog.open}
        onClose={() => setLockDialog({ open: false, topicId: null, action: "lock" })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {lockDialog.action === "lock" ? "Xác nhận khóa đề tài" : "Xác nhận mở khóa đề tài"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {lockDialog.action === "lock"
              ? "Sau khi khóa, sinh viên sẽ không thể đăng ký thêm vào đề tài này. Bạn sẽ nhận danh sách ứng viên để duyệt."
              : "Mở khóa sẽ cho phép sinh viên tiếp tục đăng ký đề tài này."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLockDialog({ open: false, topicId: null, action: "lock" })}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color={lockDialog.action === "lock" ? "error" : "success"}
            onClick={() => {
              if (lockDialog.topicId) {
                const topic = topics.find((t) => t.id === lockDialog.topicId);
                if (topic) handleLockToggle(lockDialog.topicId, topic.status);
              }
            }}
          >
            {lockDialog.action === "lock" ? "Khóa đề tài" : "Mở khóa"}
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
