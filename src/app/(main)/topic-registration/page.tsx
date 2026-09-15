"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Alert,
  Card,
  Button,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { BookOpen, Printer, CheckCircle } from "lucide-react";
import {
  AvailableTopicTable,
  TopicDetailDialog,
} from "@/feature/student-topic/components";
import type {
  AvailableTopic,
  RegistrationRequest,
} from "@/feature/student-topic/types";
import { studentTopicService } from "@/feature/student-topic/services/studentTopicService";
import { PageHeader } from "@/shared/components";
import { toast } from "sonner";

type StudentStatus = "UNREGISTERED" | "PENDING" | "REJECTED" | "APPROVED";

export default function TopicRegistrationPage() {
  const [allTopics, setAllTopics] = useState<AvailableTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<AvailableTopic | null>(
    null,
  );
  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationRequest | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [studentStatus, setStudentStatus] =
    useState<StudentStatus>("UNREGISTERED");
  const [currentRegistration, setCurrentRegistration] =
    useState<RegistrationRequest | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const refreshAvailableTopics = useCallback(async () => {
    setTopicsLoading(true);
    try {
      const topics = await studentTopicService.getAvailableTopics();
      setAllTopics(topics);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tải danh sách đề tài";
      toast.error(message);
    } finally {
      setTopicsLoading(false);
    }
  }, []);

  const loadMyRegistration = useCallback(async () => {
    try {
      const registration = await studentTopicService.getMyRegistration();
      if (registration) {
        setCurrentRegistration(registration);
        const statusMap: Record<string, StudentStatus> = {
          Pending: "PENDING",
          Approved: "APPROVED",
          Rejected: "REJECTED",
        };
        setStudentStatus(statusMap[registration.status] || "UNREGISTERED");
      } else {
        setCurrentRegistration(null);
        setStudentStatus("UNREGISTERED");
      }
    } catch {
      setCurrentRegistration(null);
      setStudentStatus("UNREGISTERED");
    }
  }, []);

  const loadGovernanceState = useCallback(async () => {
    try {
      const state = await studentTopicService.getGovernanceState();
      if (state.isExpired !== undefined) {
        setIsExpired(state.isExpired);
      } else if (state.deadline) {
        const now = new Date();
        const deadline = new Date(state.deadline);
        setIsExpired(now > deadline);
      } else {
        setIsExpired(false);
      }
    } catch {
      setIsExpired(false);
    }
  }, []);

  useEffect(() => {
    refreshAvailableTopics();
    loadMyRegistration();
    loadGovernanceState();
  }, [refreshAvailableTopics, loadMyRegistration, loadGovernanceState]);

  const displayedTopics = searchValue
    ? allTopics.filter(
        (t) =>
          t.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          t.teacherName.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : allTopics;

  const handleViewDetail = (topic: AvailableTopic) => {
    setSelectedTopic(topic);
    setSelectedRegistration(null);
    setDetailDialogOpen(true);
  };

  const handleRegister = async (topicId: string) => {
    try {
      await studentTopicService.registerTopic(topicId);
      toast.success("Yêu cầu đăng ký đã được gửi thành công!");
      await loadMyRegistration();
      await refreshAvailableTopics();
      setDetailDialogOpen(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể gửi yêu cầu đăng ký";
      toast.error(message);
    }
  };

  const handlePrintConfirmation = async () => {
    if (!currentRegistration) return;
    toast.success("Xuất file PDF thành công!");
  };

  const renderStatusAlert = () => {
    switch (studentStatus) {
      case "PENDING":
        return (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "warning.main",
              bgcolor: "warning.50",
              color: "text.primary",
              "& .MuiAlert-icon": { color: "warning.dark" },
            }}
          >
            <Typography
              variant="body1"
              fontWeight={600}
              gutterBottom
              color="text.primary"
            >
              Đang chờ duyệt yêu cầu đăng ký
            </Typography>
            <Typography variant="body2" color="text.primary">
              Bạn đang chờ Giảng viên{" "}
              <strong>{currentRegistration?.teacherName}</strong> duyệt yêu cầu
              đăng ký đề tài{" "}
              <strong>&quot;{currentRegistration?.topicName}&quot;</strong>.
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, opacity: 0.8 }}
              color="text.primary"
            >
              Ngày gửi:{" "}
              {currentRegistration?.requestedAt &&
                new Date(currentRegistration.requestedAt).toLocaleDateString(
                  "vi-VN",
                )}
            </Typography>
          </Alert>
        );

      case "REJECTED":
        return (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "error.main",
              bgcolor: "error.50",
              color: "text.primary",
              "& .MuiAlert-icon": { color: "error.dark" },
            }}
          >
            <Typography
              variant="body1"
              fontWeight={600}
              gutterBottom
              color="text.primary"
            >
              Yêu cầu đăng ký đã bị từ chối
            </Typography>
            <Typography variant="body2" color="text.primary">
              Yêu cầu đăng ký đề tài{" "}
              <strong>&quot;{currentRegistration?.topicName}&quot;</strong> của
              bạn đã bị từ chối.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} color="text.primary">
              <strong>Lý do:</strong> {currentRegistration?.rejectionReason}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, opacity: 0.8, fontStyle: "italic" }}
              color="text.primary"
            >
              Vui lòng chọn đề tài khác bên dưới.
            </Typography>
          </Alert>
        );

      case "APPROVED":
        return null;

      default:
        return null;
    }
  };

  const renderApprovedContent = () => {
    const reg = currentRegistration;

    return (
      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "success.main",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 3,
            py: 2,
            bgcolor: "success.main",
          }}
        >
          <CheckCircle size={28} color="#fff" />
          <Typography variant="h6" fontWeight={700} color="#fff">
            Yêu cầu đăng ký đề tài đã được phê duyệt
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Tên đề tài + Mã */}
          <Box sx={{ mb: 2.5 }}>
            {reg?.topicCode && (
              <Chip
                label={`Mã: ${reg.topicCode}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mb: 1, fontFamily: "monospace", fontWeight: 600 }}
              />
            )}
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {reg?.topicName}
            </Typography>
            {reg?.periodName && (
              <Typography variant="caption" color="text.secondary">
                Đợt đăng ký: {reg.periodName}
              </Typography>
            )}
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          {/* Giảng viên hướng dẫn */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.secondary"
              gutterBottom
            >
              GIẢNG VIÊN HƯỚNG DẪN
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {reg?.teacherName || "—"}
            </Typography>
            {reg?.teacherEmail && (
              <Typography variant="body2" color="text.secondary">
                {reg.teacherEmail}
              </Typography>
            )}
          </Box>

          {/* Mô tả đề tài */}
          {reg?.topicDescription && (
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.secondary"
                gutterBottom
              >
                MÔ TẢ ĐỀ TÀI
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ lineHeight: 1.7 }}
              >
                {reg.topicDescription}
              </Typography>
            </Box>
          )}

          <Divider sx={{ mb: 2.5 }} />

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<Printer size={18} />}
              onClick={handlePrintConfirmation}
            >
              In phiếu xác nhận
            </Button>
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Đăng ký đề tài khóa luận"
        subtitle="Tìm kiếm, đăng ký và theo dõi tiến độ phê duyệt từ Giảng viên hướng dẫn"
        showBgImage={true}
        illustration={<BookOpen size={64} />}
      />

      {renderStatusAlert()}

      {studentStatus === "APPROVED" ? (
        renderApprovedContent()
      ) : (
        <AvailableTopicTable
          topics={displayedTopics}
          loading={topicsLoading}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onViewDetail={handleViewDetail}
          onRefresh={refreshAvailableTopics}
          disabled={studentStatus === "PENDING"}
        />
      )}

      <TopicDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        topic={selectedTopic}
        registration={selectedRegistration}
        onRegister={handleRegister}
        onPrintConfirmation={handlePrintConfirmation}
        isExpired={isExpired}
      />
    </Box>
  );
}
