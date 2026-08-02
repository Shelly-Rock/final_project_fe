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

  // Refresh topics list
  const refreshTopics = useCallback(() => {
    setTopicsLoading(true);
    myTopicService
      .getAll()
      .then((data) => {
        setAllTopics(data);
      })
      .catch(() => toast.error("Không thể tải danh sách đề tài"))
      .finally(() => setTopicsLoading(false));
  }, []);

  // Refresh pending requests
  const refreshPendingRequests = useCallback(() => {
    setRequestsLoading(true);
    myTopicService
      .getPendingRequests()
      .then(setPendingRequests)
      .catch(() => toast.error("Không thể tải danh sách yêu cầu"))
      .finally(() => setRequestsLoading(false));
  }, []);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshTopics();
      refreshPendingRequests();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshTopics, refreshPendingRequests]);

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
      refreshPendingRequests();
      toast.success("Đã xóa đề tài");
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleToggleLock = async (topic: MyTopic) => {
    // TODO: Tích hợp API PATCH /api/topics/:id/toggle-lock
    // Mock: Toggle registration status between OPEN and LOCKED
    const newStatus = topic.registrationStatus === "LOCKED" ? "OPEN" : "LOCKED";

    setAllTopics((prev) =>
      prev.map((t) =>
        t.id === topic.id ? { ...t, registrationStatus: newStatus } : t,
      ),
    );

    toast.success(
      newStatus === "LOCKED"
        ? "Đã khóa đề tài. Sinh viên không thể đăng ký."
        : "Đã mở khóa đề tài. Sinh viên có thể đăng ký.",
    );
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
      refreshPendingRequests();
      setFormDialogOpen(false);
    } catch {
      toast.error(selectedTopic ? "Cập nhật thất bại" : "Tạo mới thất bại");
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
      refreshPendingRequests();
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
      refreshPendingRequests();
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
