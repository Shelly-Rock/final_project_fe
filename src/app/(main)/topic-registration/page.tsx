"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Alert, Card, Button, Typography } from "@mui/material";
import { BookOpen, Printer, CheckCircle } from "lucide-react";
import {
  AvailableTopicTable,
  TopicDetailDialog,
} from "@/feature/student-topic/components";
import type {
  AvailableTopic,
  RegistrationRequest,
  RegisteredStudent,
} from "@/feature/student-topic/types";
import {
  mockTopics,
  mockLecturers,
  mockRegisteredStudents,
  getDepartmentName,
} from "@/feature/admin/mockData";
import { PageHeader } from "@/shared/components";
import { toast } from "sonner";

// Simulate student with specialization
const CURRENT_STUDENT_SPECIALIZATION = "SPEC_01"; // Công nghệ phần mềm

type StudentStatus = "UNREGISTERED" | "PENDING" | "REJECTED" | "APPROVED";

// Initial mock state
const INITIAL_MOCK_STATUS: StudentStatus = "UNREGISTERED"; // Change to test

// Mock registrations data
const createMockRegistration = (
  topicId: string,
  topicName: string,
  teacherName: string,
  teacherEmail: string,
  status: "Pending" | "Approved" | "Rejected",
  rejectionReason?: string,
): RegistrationRequest => ({
  id: `reg-${Date.now()}`,
  topicId,
  topicName,
  teacherName,
  teacherEmail,
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
    "TOPIC_01",
    "Xây dựng hệ thống quản lý đề tài khóa luận tốt nghiệp",
    "Nguyễn Văn An",
    "nv.an@ctu.edu.vn",
    "Pending",
  ),
  REJECTED: createMockRegistration(
    "TOPIC_04",
    "Phát triển ứng dụng di động cho thương mại điện tử",
    "Trần Thị Bình",
    "tt.binh@ctu.edu.vn",
    "Rejected",
    "Đề tài đã có sinh viên khác đăng ký trước. Vui lòng chọn đề tài khác.",
  ),
  APPROVED: createMockRegistration(
    "TOPIC_01",
    "Xây dựng hệ thống quản lý đề tài khóa luận tốt nghiệp",
    "Nguyễn Văn An",
    "nv.an@ctu.edu.vn",
    "Approved",
  ),
};

// Helper to get department for lecturer
function getLecturerDepartment(lecturerId: number): string {
  const lecturer = mockLecturers.find((l) => l.id === lecturerId);
  if (!lecturer) return "";
  return getDepartmentName(lecturer.departmentId);
}

// Helper to format lecturer display
function formatLecturerDisplay(lecturerId: number): string {
  const lecturer = mockLecturers.find((l) => l.id === lecturerId);
  if (!lecturer) return "";
  const department = getDepartmentName(lecturer.departmentId);
  return `${lecturer.name} - [${department}]`;
}

// Convert mock topics to AvailableTopic format
function convertToAvailableTopic(
  topic: (typeof mockTopics)[0],
): AvailableTopic {
  // For TOPIC_04 (3 students), show all 3 registered students
  // For TOPIC_01 (1 student), show 1 registered student
  const registeredStudentsList: RegisteredStudent[] =
    topic.id === "TOPIC_04"
      ? mockRegisteredStudents.slice(1, 4) // 3 students
      : topic.id === "TOPIC_01"
        ? [mockRegisteredStudents[0]] // 1 student
        : [];

  return {
    id: topic.id,
    name: topic.name,
    englishName: topic.englishName,
    description: topic.description,
    objectives: topic.objectives,
    technologies: topic.technologies,
    teacherName: topic.lecturerName,
    teacherEmail: topic.lecturerEmail,
    department: getDepartmentName(
      mockLecturers.find((l) => l.id === topic.lecturerId)?.departmentId || "",
    ),
    maxStudents: topic.maxStudents,
    registeredCount: topic.registeredCount,
    status: topic.status,
    registrationStatus: topic.registrationStatus,
    registeredStudents: registeredStudentsList,
    createdAt: topic.createdAt,
  };
}

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

  // Current student status - reactive state
  const [studentStatus, setStudentStatus] =
    useState<StudentStatus>(INITIAL_MOCK_STATUS);

  // Get current registration based on status
  const currentRegistration =
    studentStatus === "UNREGISTERED" ? null : MOCK_REGISTRATIONS[studentStatus];

  // Filter topics by specialization - only show topics allowed for current student's specialization
  const filteredTopics = useMemo(() => {
    return mockTopics.filter(
      (t) =>
        t.status === "Approved" &&
        t.allowedSpecializationIds.includes(CURRENT_STUDENT_SPECIALIZATION),
    );
  }, []);

  // Refresh available topics
  const refreshAvailableTopics = useCallback(() => {
    setTopicsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const availableTopics = filteredTopics.map(convertToAvailableTopic);
      setAllTopics(availableTopics);
      setTopicsLoading(false);
    }, 300);
  }, [filteredTopics]);

  // Initial load
  useEffect(() => {
    refreshAvailableTopics();
  }, [refreshAvailableTopics]);

  // Filter topics by search
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
    // TODO: Tích hợp API sau
    const topic = displayedTopics.find((t) => t.id === topicId);
    if (topic) {
      setStudentStatus("PENDING");
      toast.success("Yêu cầu đăng ký đã được gửi thành công!");
      refreshAvailableTopics();
    }
  };

  const handlePrintConfirmation = async () => {
    if (!currentRegistration) return;
    // TODO: Tích hợp API sau
    toast.success("Xuất file PDF thành công!");
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
            {/* Tên tiếng Anh */}
            {approvedTopic.englishName && (
              <>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  color="text.primary"
                >
                  Tên tiếng Anh:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, pl: 2 }}
                  color="text.primary"
                >
                  {approvedTopic.englishName}
                </Typography>
              </>
            )}

            {/* Mô tả */}
            <Typography
              variant="subtitle2"
              fontWeight={600}
              gutterBottom
              color="text.primary"
            >
              Mô tả đề tài:
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, pl: 2 }}
              color="text.primary"
            >
              {approvedTopic.description}
            </Typography>

            {/* Mục tiêu */}
            {approvedTopic.objectives && (
              <>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  color="text.primary"
                >
                  Mục tiêu đề tài:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, pl: 2 }}
                  color="text.primary"
                >
                  {approvedTopic.objectives}
                </Typography>
              </>
            )}

            {/* Công nghệ sử dụng */}
            {approvedTopic.technologies && (
              <>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  color="text.primary"
                >
                  Công nghệ sử dụng:
                </Typography>
                <Typography variant="body2" sx={{ pl: 2 }} color="text.primary">
                  {approvedTopic.technologies}
                </Typography>
              </>
            )}
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

      {/* Info Banner */}
      <Alert
        severity="info"
        sx={{
          mb: 2,
          borderRadius: 2,
          "& .MuiAlert-icon": { color: "info.main" },
        }}
      >
        <Typography variant="body2">
          <strong>Chuyên ngành của bạn:</strong> Công nghệ phần mềm. Chỉ hiển
          thị các đề tài phù hợp với chuyên ngành đã đăng ký.
        </Typography>
      </Alert>

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
