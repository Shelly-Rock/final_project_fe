"use client";

import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { FileText } from "lucide-react";
import {
  TopicDataTable,
  PendingRequestTable,
  TopicFormDialog,
  ApproveConfirmDialog,
  RejectConfirmDialog,
  LockAssignmentDialog,
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

  // Approve dialog state
  const [approveDialogRequest, setApproveDialogRequest] =
    useState<PendingRequest | null>(null);
  const [approving, setApproving] = useState(false);

  // Form dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<MyTopic | null>(null);
  const [isExceptionMode, setIsExceptionMode] = useState(false);

  // Lock and Team management state
  const [lockDialogTopic, setLockDialogTopic] = useState<MyTopic | null>(null);
  const [lockingTopic, setLockingTopic] = useState(false);

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
                studentMessage: s.studentMessage,
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
    if (topic.registrationStatus === "LOCKED") return;
    setLockDialogTopic(topic);
  };

  const submitLockAssignments = async (
    topicId: number,
    assignments: {
      projectId: number;
      assignedTask: string;
      isLeader: boolean;
    }[],
  ) => {
    setLockingTopic(true);
    try {
      await myTopicService.lockWithAssignments(topicId, assignments);
      refreshTopics();
      toast.success("Đã khóa và phân công nhiệm vụ thành công");
      setLockDialogTopic(null);
    } catch {
      toast.error("Khóa và phân công thất bại");
    } finally {
      setLockingTopic(false);
    }
  };

  const handleChangeLeader = async (topicId: number, projectId: number) => {
    await myTopicService.changeLeader(topicId, projectId);
    toast.success("Thay đổi trưởng nhóm thành công");
    refreshTopics();
    setSelectedTopic((prev) =>
      prev && prev.id === topicId
        ? {
            ...prev,
            registeredStudents: prev.registeredStudents.map((s) => ({
              ...s,
              isLeader: s.id === projectId,
            })),
          }
        : prev,
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

  // States for reject confirm dialog
  const [rejectDialogRequest, setRejectDialogRequest] =
    useState<PendingRequest | null>(null);
  const [rejecting, setRejecting] = useState(false);

  const handleApproveRequest = (request: PendingRequest) => {
    setApproveDialogRequest(request);
  };

  const handleConfirmApprove = async () => {
    if (!approveDialogRequest) return;
    setApproving(true);
    try {
      await myTopicService.approveRegistration({
        topicId: approveDialogRequest.topicId,
        studentId: approveDialogRequest.studentId,
      });
      refreshTopics();
      toast.success(`Đã duyệt yêu cầu của ${approveDialogRequest.studentName}`);
      setApproveDialogRequest(null);
    } catch {
      toast.error("Duyệt thất bại");
    } finally {
      setApproving(false);
    }
  };

  const handleRejectRequest = (request: PendingRequest) => {
    setRejectDialogRequest(request);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectDialogRequest) return;
    setRejecting(true);
    try {
      await myTopicService.rejectRegistration({
        topicId: rejectDialogRequest.topicId,
        studentId: rejectDialogRequest.studentId,
        reason,
      });
      refreshTopics();
      toast.success(
        `Đã từ chối yêu cầu của ${rejectDialogRequest.studentName}`,
      );
      setRejectDialogRequest(null);
    } catch {
      toast.error("Từ chối thất bại");
    } finally {
      setRejecting(false);
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
          loading={requestsLoading}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      {/* Tabs Layout */}
      <Card padding={0} variant="outlined">
        <Tabs items={tabItems} />
      </Card>

      {/* Form Dialog */}
      <TopicFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
        onChangeLeader={handleChangeLeader}
        topic={selectedTopic}
        isException={isExceptionMode}
        loading={formLoading}
      />

      {/* Approve Confirm Dialog */}
      <ApproveConfirmDialog
        open={!!approveDialogRequest}
        onClose={() => setApproveDialogRequest(null)}
        onConfirm={handleConfirmApprove}
        request={approveDialogRequest}
        loading={approving}
      />

      {/* Reject Confirm Dialog */}
      <RejectConfirmDialog
        open={!!rejectDialogRequest}
        onClose={() => setRejectDialogRequest(null)}
        onConfirm={handleConfirmReject}
        request={rejectDialogRequest}
        loading={rejecting}
      />

      {/* Lock and Assignment Dialog */}
      <LockAssignmentDialog
        open={!!lockDialogTopic}
        onClose={() => setLockDialogTopic(null)}
        topic={lockDialogTopic}
        onSubmit={submitLockAssignments}
      />
    </Box>
  );
}
