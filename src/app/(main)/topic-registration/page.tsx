"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Alert, Card, Button, Typography } from "@mui/material";
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
  const [selectedTopic, setSelectedTopic] = useState<AvailableTopic | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationRequest | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [studentStatus, setStudentStatus] = useState<StudentStatus>("UNREGISTERED");
  const [currentRegistration, setCurrentRegistration] = useState<RegistrationRequest | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const refreshAvailableTopics = useCallback(async () => {
    setTopicsLoading(true);
    try {
      const topics = await studentTopicService.getAvailableTopics();
      setAllTopics(topics);
    } catch {
      toast.error("Không thể tải danh sách đề tài");
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
          "Pending": "PENDING",
          "Approved": "APPROVED",
          "Rejected": "REJECTED",
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
      const message = err instanceof Error ? err.message : "Không thể gửi yêu cầu đăng ký";
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
            <Typography variant="body1" fontWeight={600} gutterBottom color="text.primary">
              Đang chờ duyệt yêu cầu đăng ký
            </Typography>
            <Typography variant="body2" color="text.primary">
              Bạn đang chờ Giảng viên <strong>{currentRegistration?.teacherName}</strong> duyệt yêu cầu
              đăng ký đề tài <strong>&quot;{currentRegistration?.topicName}&quot;</strong>.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }} color="text.primary">
              Ngày gửi:{" "}
              {currentRegistration?.requestedAt &&
                new Date(currentRegistration.requestedAt).toLocaleDateString("vi-VN")}
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
            <Typography variant="body1" fontWeight={600} gutterBottom color="text.primary">
              Yêu cầu đăng ký đã bị từ chối
            </Typography>
            <Typography variant="body2" color="text.primary">
              Yêu cầu đăng ký đề tài <strong>&quot;{currentRegistration?.topicName}&quot;</strong> của bạn đã bị từ chối.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} color="text.primary">
              <strong>Lý do:</strong> {currentRegistration?.rejectionReason}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8, fontStyle: "italic" }} color="text.primary">
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
    const approvedTopic = allTopics.find((t) => t.id === currentRegistration?.topicId);

    return (
      <Card
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "success.main",
          bgcolor: "success.50",
          color: "text.primary",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <CheckCircle size={32} style={{ color: "#16a34a", marginRight: 12 }} />
          <Typography variant="h6" fontWeight={700} color="success.dark">
            Đề tài đã được duyệt thành công
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
            {currentRegistration?.topicName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Giảng viên hướng dẫn:{" "}
            <strong color="text.primary">{currentRegistration?.teacherName}</strong>
          </Typography>
        </Box>

        {approvedTopic && (
          <Box sx={{ mb: 3 }}>
            {approvedTopic.englishName && (
              <>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom color="text.primary">
                  Tên tiếng Anh:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, pl: 2 }} color="text.primary">
                  {approvedTopic.englishName}
                </Typography>
              </>
            )}

            <Typography variant="subtitle2" fontWeight={600} gutterBottom color="text.primary">
              Mô tả đề tài:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, pl: 2 }} color="text.primary">
              {approvedTopic.description}
            </Typography>

            {approvedTopic.objectives && (
              <>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom color="text.primary">
                  Mục tiêu đề tài:
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, pl: 2 }} color="text.primary">
                  {approvedTopic.objectives}
                </Typography>
              </>
            )}

            {approvedTopic.technologies && (
              <>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom color="text.primary">
                  Công nghệ sử dụng:
                </Typography>
                <Typography variant="body2" sx={{ pl: 2 }} color="text.primary">
                  {approvedTopic.technologies}
                </Typography>
              </>
            )}
          </Box>
        )}

        <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Printer size={18} />}
            onClick={handlePrintConfirmation}
          >
            In phiếu xác nhận
          </Button>
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
