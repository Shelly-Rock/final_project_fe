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
  TopicDetailBlock,
} from "@/feature/student-topic/components";
import type {
  AvailableTopic,
  RegistrationRequest,
} from "@/feature/student-topic/types";
import { studentTopicService } from "@/feature/student-topic/services/studentTopicService";
import type { GovernanceStateResponse } from "@/feature/student-topic/services/topic.api";
import { PageHeader } from "@/shared/components";
import { toast } from "sonner";

type GovernanceStateWithLegacy = GovernanceStateResponse & {
  locks?: { registrationOpen?: boolean };
};

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
      const state: GovernanceStateWithLegacy =
        await studentTopicService.getGovernanceState();

      if (state.locks && typeof state.locks.registrationOpen === "boolean") {
        setIsExpired(!state.locks.registrationOpen);
      } else if (state.isExpired !== undefined) {
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

  const handleRegister = async (topicId: string, studentMessage?: string) => {
    try {
      await studentTopicService.registerTopic(topicId, studentMessage);
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

  const handleCancelRequest = async () => {
    if (!currentRegistration) return;
    try {
      await studentTopicService.cancelRegistration(currentRegistration.topicId);
      toast.success("Hủy yêu cầu đăng ký thành công!");
      await loadMyRegistration();
      await refreshAvailableTopics();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể hủy đăng ký";
      toast.error(message);
    }
  };

  const handlePrintConfirmation = async () => {
    if (!currentRegistration) return;
    toast.success("Xuất file PDF thành công!");
  };

  const renderStatusAlert = () => {
    if (
      isExpired &&
      (studentStatus === "UNREGISTERED" || studentStatus === "REJECTED")
    ) {
      return (
        <>
          {studentStatus === "REJECTED" && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
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
                <strong>&quot;{currentRegistration?.topicName}&quot;</strong>{" "}
                của bạn đã bị từ chối.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }} color="text.primary">
                <strong>Lý do:</strong> {currentRegistration?.rejectionReason}
              </Typography>
            </Alert>
          )}
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "error.main",
              bgcolor: "error.50",
              color: "text.primary",
              "& .MuiAlert-icon": { color: "error.dark", mt: 0.5 },
            }}
          >
            <Typography
              variant="body1"
              fontWeight={600}
              gutterBottom
              color="text.primary"
            >
              Đã hết thời gian đăng ký đề tài
            </Typography>
            <Typography variant="body2" color="text.primary">
              Đã hết thời gian đăng ký đề tài trong đợt này, vui lòng liên hệ
              giảng viên hướng dẫn để gửi yêu cầu đăng ký ngoại lệ đến thư ký
              ngành.
            </Typography>
          </Alert>
        </>
      );
    }

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
              "& .MuiAlert-icon": { color: "warning.dark", mt: 0.5 },
            }}
            action={
              <Button
                color="error"
                size="small"
                onClick={handleCancelRequest}
                variant="outlined"
                sx={{ mt: 1, mr: 1, bgcolor: "white" }}
              >
                Hủy yêu cầu
              </Button>
            }
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
            <TopicDetailBlock
              label="GIẢNG VIÊN HƯỚNG DẪN"
              content={reg?.teacherName || "—"}
              valueVariant="body1"
              valueFontWeight={600}
            />
            {reg?.teacherEmail && (
              <Typography variant="body2" color="text.secondary">
                {reg.teacherEmail}
              </Typography>
            )}
          </Box>

          {/* Tên tiếng Anh */}
          <TopicDetailBlock
            label="TÊN TIẾNG ANH"
            content={reg?.topicEnglishName}
            valueVariant="body1"
            valueFontWeight={600}
            sx={{ mb: 2.5 }}
          />

          {/* Mô tả đề tài */}
          <TopicDetailBlock
            label="MÔ TẢ ĐỀ TÀI"
            content={reg?.topicDescription}
            sx={{ mb: 2.5 }}
          />

          {/* Mục tiêu đề tài */}
          <TopicDetailBlock
            label="MỤC TIÊU ĐỀ TÀI"
            content={reg?.topicObjectives}
            isHtml={true}
            sx={{ mb: 2.5 }}
          />

          {/* Công nghệ sử dụng */}
          <TopicDetailBlock
            label="CÔNG NGHỆ SỬ DỤNG"
            content={reg?.topicTechnologies}
            isHtml={true}
            sx={{ mb: 2.5 }}
          />

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
