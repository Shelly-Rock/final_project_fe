"use client";

import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { FileText } from "lucide-react";
import {
  TopicDataTable,
  PendingRequestTable,
  TopicFormDialog,
} from "@/feature/my-topic/components";
import {
  myTopicService,
  type MyTopic,
  type PendingRequest,
  type CreateTopicInput,
} from "@/feature/my-topic";
import { PageHeader, Card, Tabs } from "@/shared/components";
import { toast } from "sonner";

export default function MyTopicsPage() {
  // Topics state
  const [allTopics, setAllTopics] = useState<MyTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);

  // Pending requests state
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Form dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<MyTopic | null>(null);
  const [isExceptionMode, setIsExceptionMode] = useState(false);

  // Search state
  const [searchValue, setSearchValue] = useState("");

  // Refresh topics list (pending requests are derived from the same payload)
  const refreshTopics = useCallback(() => {
    setTopicsLoading(true);
    setRequestsLoading(true);
    myTopicService
      .getAll()
      .then((data) => {
        setAllTopics(data);
        setPendingRequests(
          data.flatMap((topic) =>
            topic.registeredStudents
              .filter((s) => s.status === "Pending")
              .map((s) => ({
                id: s.id,
                studentId: s.studentId,
                studentName: s.studentName,
                studentCode: s.studentCode,
                topicId: topic.id,
                topicName: topic.name,
                requestedAt: s.registeredAt,
                status: "Pending" as const,
              })),
          ),
        );
      })
      .catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : "";
        if (
          errorMessage.includes("403") ||
          errorMessage.includes("Forbidden")
        ) {
          toast.error("Bạn không có quyền truy cập chức năng này");
        } else {
          toast.error("Không thể tải danh sách đề tài");
        }
      })
      .finally(() => {
        setTopicsLoading(false);
        setRequestsLoading(false);
      });
  }, []);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshTopics();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshTopics]);

  // Filter topics by search - derived state
  const displayedTopics = searchValue
    ? allTopics.filter(
        (t) =>
          t.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          t.description.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : allTopics;

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleCreateTopic = () => {
    setSelectedTopic(null);
    setIsExceptionMode(false);
    setFormDialogOpen(true);
  };

  const handleCreateException = () => {
    setSelectedTopic(null);
    setIsExceptionMode(true);
    setFormDialogOpen(true);
  };

  const handleEditTopic = (topic: MyTopic) => {
    setSelectedTopic(topic);
    setIsExceptionMode(false);
    setFormDialogOpen(true);
  };

  const handleDeleteTopic = async (topic: MyTopic) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa đề tài "${topic.name}"?\n\nHành động này không thể hoàn tác.`,
    );
    if (!confirmed) return;

    try {
      await myTopicService.delete(topic.id);
      refreshTopics();
      toast.success("Đã xóa đề tài");
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleToggleLock = async (topic: MyTopic) => {
    try {
      const isCurrentlyLocked = topic.registrationStatus === "LOCKED";

      if (!isCurrentlyLocked) {
        await myTopicService.toggleLock(topic.id, true);
        refreshTopics();
        toast.success("Đã khóa đề tài");
      } else {
        await myTopicService.toggleLock(topic.id, false);
        refreshTopics();
        toast.success("Đã mở khóa đề tài. Sinh viên có thể đăng ký.");
      }
    } catch {
      toast.error("Không thể thay đổi trạng thái khóa đề tài");
    }
  };

  const handleFormSubmit = async (data: CreateTopicInput) => {
    setFormLoading(true);
    try {
      if (selectedTopic) {
        await myTopicService.update(selectedTopic.id, data);
        toast.success("Cập nhật thành công");
      } else {
        await myTopicService.create(data);
        toast.success(
          isExceptionMode ? "Đã gửi đề xuất ngoại lệ" : "Tạo mới thành công",
        );
      }
      refreshTopics();
      setFormDialogOpen(false);
    } catch (error: unknown) {
      const errorMsg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as { message?: string })?.message ||
        (selectedTopic ? "Cập nhật thất bại" : "Tạo mới thất bại");
      toast.error(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleApproveRequest = async (request: PendingRequest) => {
    try {
      await myTopicService.approveRegistration({
        topicId: request.topicId,
        studentId: request.studentId,
      });
      refreshTopics();
      toast.success(`Đã duyệt yêu cầu của ${request.studentName}`);
    } catch {
      toast.error("Duyệt thất bại");
    }
  };

  const handleRejectRequest = async (request: PendingRequest) => {
    const reason = window.prompt(
      `Nhập lý do từ chối yêu cầu của "${request.studentName}":`,
    );
    if (reason === null) return; // User cancelled

    try {
      await myTopicService.rejectRegistration({
        topicId: request.topicId,
        studentId: request.studentId,
        reason: reason || "Không đạt yêu cầu",
      });
      refreshTopics();
      toast.success(`Đã từ chối yêu cầu của ${request.studentName}`);
    } catch {
      toast.error("Từ chối thất bại");
    }
  };

  // Tab items
  const pendingCount = pendingRequests.length;
  const tabItems = [
    {
      label: "Danh sách đề tài",
      content: (
        <TopicDataTable
          topics={displayedTopics}
          loading={topicsLoading}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onEdit={handleEditTopic}
          onDelete={handleDeleteTopic}
          onCreate={handleCreateTopic}
          onCreateException={handleCreateException}
          onRefresh={refreshTopics}
          onToggleLock={handleToggleLock}
        />
      ),
    },
    {
      label: `Yêu cầu chờ duyệt${pendingCount > 0 ? ` (${pendingCount})` : ""}`,
      content: (
        <PendingRequestTable
          requests={pendingRequests}
          topics={allTopics}
          loading={requestsLoading}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      {/* Page Header */}
      <PageHeader
        title="Quản lý đề tài của tôi"
        subtitle="Tạo và quản lý các đề tài khóa luận của bạn"
        showBgImage={true}
        illustration={<FileText size={64} />}
      />

      {/* Tabs Layout */}
      <Card padding={0} variant="outlined">
        <Tabs items={tabItems} />
      </Card>

      {/* Form Dialog */}
      <TopicFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
        topic={selectedTopic}
        isException={isExceptionMode}
        loading={formLoading}
      />
    </Box>
  );
}
