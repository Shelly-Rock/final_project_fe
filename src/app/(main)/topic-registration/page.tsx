"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Alert, Card, Button, Typography } from "@mui/material";
import { BookOpen, Printer, CheckCircle } from "lucide-react";
import {
  AvailableTopicTable,
  TopicDetailDialog,
} from "@/feature/student-topic/components";
import {
  studentTopicService,
  type AvailableTopic,
  type RegistrationRequest,
} from "@/feature/student-topic";
import { PageHeader } from "@/shared/components";
import { toast } from "sonner";

type StudentStatus = "UNREGISTERED" | "PENDING" | "REJECTED" | "APPROVED";

// Initial mock state
const INITIAL_MOCK_STATUS: StudentStatus = "UNREGISTERED"; // Change this to "UNREGISTERED", "PENDING", or "REJECTED" to test different scenarios

// Mock registrations data
const createMockRegistration = (
  topicId: string,
  topicName: string,
  teacherName: string,
  status: "Pending" | "Approved" | "Rejected",
  rejectionReason?: string,
): RegistrationRequest => ({
  id: `reg-${Date.now()}`,
  topicId,
  topicName,
  teacherName,
  teacherEmail: `${teacherName.toLowerCase().replace(/\s+/g, "")}@university.edu`,
  studentId: "student-001",
  studentName: "Nguyễn Văn Sinh",
  requestedAt: new Date().toISOString(),
  status,
  rejectionReason,
});

// Mock registrations for each status
const MOCK_REGISTRATIONS: Record<
  Exclude<StudentStatus, "UNREGISTERED">,
  RegistrationRequest
> = {
  PENDING: createMockRegistration(
    "topic-001",
    "Xây dựng hệ thống quản lý học tập LMS",
    "TS. Nguyễn Văn A",
    "Pending",
  ),
  REJECTED: createMockRegistration(
    "topic-002",
    "Phát triển ứng dụng di động thương mại điện tử",
    "PGS.TS. Trần Thị B",
    "Rejected",
    "Đề tài đã có sinh viên khác đăng ký trước. Vui lòng chọn đề tài khác.",
  ),
  APPROVED: createMockRegistration(
    "topic-003",
    "Nghiên cứu và ứng dụng AI trong phân tích dữ liệu giáo dục",
    "TS. Lê Đức C",
    "Approved",
  ),
};

export default function TopicRegistrationPage() {
  // Available topics state
  const [allTopics, setAllTopics] = useState<AvailableTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);

  // Dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<AvailableTopic | null>(
    null,
  );
  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationRequest | null>(null);

  // Search state
  const [searchValue, setSearchValue] = useState("");

  // Current student status - reactive state (mock data, replace with API in production)
  const [studentStatus, setStudentStatus] =
    useState<StudentStatus>(INITIAL_MOCK_STATUS);

  // Get current registration based on status - derived state
  const currentRegistration =
    studentStatus === "UNREGISTERED" ? null : MOCK_REGISTRATIONS[studentStatus];

  // Refresh available topics
  const refreshAvailableTopics = useCallback(() => {
    setTopicsLoading(true);
    studentTopicService
      .getAvailableTopics()
      .then((topics) => {
        setAllTopics(topics);
      })
      .catch(() => toast.error("Không thể tải danh sách đề tài"))
      .finally(() => setTopicsLoading(false));
  }, []);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshAvailableTopics();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshAvailableTopics]);

  // Filter topics by search - derived state
  const displayedTopics = searchValue
    ? allTopics.filter(
        (t) =>
          t.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          t.teacherName.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : allTopics;

  // Handlers
  const handleViewDetail = (topic: AvailableTopic) => {
    setSelectedTopic(topic);
    setSelectedRegistration(null);
    setDetailDialogOpen(true);
  };

  const handleRegister = async (topicId: string) => {
    // Mock: Chuyển sang trạng thái PENDING sau khi đăng ký
    const topic = displayedTopics.find((t) => t.id === topicId);
    if (topic) {
      setStudentStatus("PENDING");
    }

    try {
      await studentTopicService.registerTopic(topicId);
      toast.success("Yêu cầu đăng ký đã được gửi thành công!");
      refreshAvailableTopics();
    } catch {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      throw new Error("Registration failed");
    }
  };

  const handlePrintConfirmation = async () => {
    if (!currentRegistration) return;
    try {
      toast.info("Đang xuất file PDF...");
      await studentTopicService.exportConfirmationPdf(currentRegistration.id);
      toast.success("Xuất file PDF thành công!");
    } catch {
      toast.error("Xuất file thất bại. Vui lòng thử lại.");
    }
  };

  // Render status-based UI
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
    const approvedTopic = allTopics.find(
      (t) => t.id === currentRegistration?.topicId,
    );

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
          <CheckCircle
            size={32}
            style={{ color: "#16a34a", marginRight: 12 }}
          />
          <Typography variant="h6" fontWeight={700} color="success.dark">
            Đề tài đã được duyệt thành công
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            color="text.primary"
          >
            {currentRegistration?.topicName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Giảng viên hướng dẫn:{" "}
            <strong color="text.primary">
              {currentRegistration?.teacherName}
            </strong>
          </Typography>
        </Box>

        {approvedTopic && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              gutterBottom
              color="text.primary"
            >
              Mục tiêu:
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, pl: 2 }}
              color="text.primary"
            >
              {approvedTopic.objectives}
            </Typography>

            <Typography
              variant="subtitle2"
              fontWeight={600}
              gutterBottom
              color="text.primary"
            >
              Yêu cầu kỹ thuật:
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, pl: 2 }}
              color="text.primary"
            >
              {approvedTopic.technicalRequirements}
            </Typography>

            <Typography
              variant="subtitle2"
              fontWeight={600}
              gutterBottom
              color="text.primary"
            >
              Kết quả mong đợi:
            </Typography>
            <Typography variant="body2" sx={{ pl: 2 }} color="text.primary">
              {approvedTopic.expectedOutcome}
            </Typography>
          </Box>
        )}

        <Box
          sx={{ mt: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
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
      {/* Page Header */}
      <PageHeader
        title="Đăng ký đề tài khóa luận"
        subtitle="Tìm kiếm, đăng ký và theo dõi tiến độ phê duyệt từ Giảng viên hướng dẫn"
        showBgImage={true}
        illustration={<BookOpen size={64} />}
      />

      {/* Status Alert */}
      {renderStatusAlert()}

      {/* Content based on status */}
      {studentStatus === "APPROVED" ? (
        // APPROVED: Hiển thị chi tiết đề tài đã chốt
        renderApprovedContent()
      ) : (
        // UNREGISTERED, PENDING, REJECTED: Hiển thị bảng đề tài
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

      {/* Topic Detail Dialog */}
      <TopicDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        topic={selectedTopic}
        registration={selectedRegistration}
        onRegister={handleRegister}
        onPrintConfirmation={handlePrintConfirmation}
        isExpired={false}
      />
    </Box>
  );
}
