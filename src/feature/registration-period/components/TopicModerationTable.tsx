"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { DataTable } from "@/shared/components";
import { Badge } from "@/shared/components";
import { Dialog } from "@/shared/components";
import { Button } from "@/shared/components";
import { Textarea } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { Topic } from "../types";

interface TopicModerationTableProps {
  topics: Topic[];
  loading?: boolean;
  onApprove: (topicId: number, note?: string) => Promise<void>;
  onReject: (topicId: number, reason: string, note?: string) => Promise<void>;
  onEdit: (topic: Topic) => void;
}

const statusConfig = {
  pending: { label: "Chờ duyệt", color: "warning" as const },
  approved: { label: "Đã duyệt", color: "success" as const },
  rejected: { label: "Từ chối", color: "error" as const },
};

interface RejectDialogState {
  open: boolean;
  topicId: number | null;
  topicName: string;
}

export function TopicModerationTable({
  topics,
  loading = false,
  onApprove,
  onReject,
  onEdit,
}: TopicModerationTableProps) {
  const [rejectDialog, setRejectDialog] = useState<RejectDialogState>({
    open: false,
    topicId: null,
    topicName: "",
  });
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const pendingCount = topics.filter((t) => t.status === "pending").length;

  const handleApprove = async (topicId: number) => {
    setActionLoading(topicId);
    try {
      await onApprove(topicId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.topicId || !rejectReason.trim()) return;
    setActionLoading(rejectDialog.topicId);
    try {
      await onReject(
        rejectDialog.topicId,
        rejectReason,
        rejectNote || undefined,
      );
      setRejectDialog({ open: false, topicId: null, topicName: "" });
      setRejectReason("");
      setRejectNote("");
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectDialog = (topic: Topic) => {
    setRejectDialog({
      open: true,
      topicId: topic.id,
      topicName: topic.name,
    });
  };

  const columns: Column<Topic>[] = [
    {
      id: "name",
      label: "Tên đề tài",
      minWidth: 250,
      format: (_, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.name}</div>
          {row.description && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginTop: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "teacherName",
      label: "GVHD",
      minWidth: 150,
    },
    {
      id: "maxStudents",
      label: "SL SV",
      minWidth: 70,
      align: "center",
      format: (val, row) => (
        <span>
          {row.registeredStudents}/{val}
        </span>
      ),
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 100,
      align: "center",
      format: (val) => {
        const config = statusConfig[val as keyof typeof statusConfig];
        return (
          <Badge label={config.label} color={config.color} variant="soft" />
        );
      },
    },
    {
      id: "moderatorNote",
      label: "Ghi chú",
      minWidth: 150,
      sortable: false,
      format: (val) =>
        val ? (
          <span
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {val as string}
          </span>
        ) : (
          <span style={{ color: "#cbd5e1" }}>—</span>
        ),
    },
    {
      id: "rejectionReason",
      label: "Lý do từ chối",
      minWidth: 150,
      sortable: false,
      format: (val) =>
        val ? (
          <span
            style={{
              fontSize: "0.75rem",
              color: "#ef4444",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {val as string}
          </span>
        ) : (
          <span style={{ color: "#cbd5e1" }}>—</span>
        ),
    },
  ];

  const actions: Action<Topic>[] = [
    {
      id: "edit",
      icon: <Pencil size={18} />,
      label: "Sửa",
      color: "primary",
      onClick: (row) => onEdit(row),
    },
    {
      id: "approve",
      icon: <Check size={18} />,
      label: "Duyệt",
      color: "primary",
      onClick: (row) => handleApprove(row.id),
    },
    {
      id: "reject",
      icon: <X size={18} />,
      label: "Từ chối",
      color: "error",
      onClick: (row) => openRejectDialog(row),
    },
  ];

  return (
    <div>
      {pendingCount > 0 && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#dbeafe",
            border: "1px solid #93c5fd",
            borderRadius: 8,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>📋</span>
          <span style={{ color: "#1e40af" }}>
            Có <strong>{pendingCount}</strong> đề tài đang chờ duyệt
          </span>
        </div>
      )}

      <DataTable
        columns={columns}
        rows={topics}
        rowKey="id"
        actions={actions}
        loading={loading}
        emptyMessage="Chưa có đề tài nào được nộp"
        showImportButton={false}
      />

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onClose={() =>
          setRejectDialog({ open: false, topicId: null, topicName: "" })
        }
        title="Từ chối đề tài"
        description={`Lý do từ chối đề tài: ${rejectDialog.topicName}`}
        size="md"
        actions={
          <>
            <Button
              variant="outlined"
              onClick={() =>
                setRejectDialog({ open: false, topicId: null, topicName: "" })
              }
              disabled={actionLoading !== null}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleReject}
              loading={actionLoading === rejectDialog.topicId}
              disabled={!rejectReason.trim()}
            >
              Từ chối
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Textarea
            label="Lý do từ chối"
            placeholder="Nhập lý do từ chối đề tài này..."
            value={rejectReason}
            onChange={(value) => setRejectReason(value)}
            minRows={3}
            required
            fullWidth
          />
          <Textarea
            label="Ghi chú thêm (tùy chọn)"
            placeholder="Nhập ghi chú bổ sung cho giảng viên..."
            value={rejectNote}
            onChange={(value) => setRejectNote(value)}
            minRows={2}
            fullWidth
          />
        </div>
      </Dialog>
    </div>
  );
}
