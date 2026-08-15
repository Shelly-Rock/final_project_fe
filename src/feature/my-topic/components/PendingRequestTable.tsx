"use client";

import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import { DataTable } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { PendingRequest, MyTopic } from "../types";

interface PendingRequestTableProps {
  requests: PendingRequest[];
  topics: MyTopic[];
  loading?: boolean;
  onApprove: (request: PendingRequest) => void;
  onReject: (request: PendingRequest) => void;
}

export function PendingRequestTable({
  requests,
  topics,
  loading = false,
  onApprove,
  onReject,
}: PendingRequestTableProps) {
  // Lấy sĩ số hiện tại của đề tài
  const getTopicEnrollment = (
    topicId: number,
  ): { current: number; max: number; isFull: boolean } => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return { current: 0, max: 0, isFull: false };

    const approvedCount =
      topic.registeredStudents?.filter((s) => s.status === "Approved").length ||
      0;
    const max = topic.maxStudents;

    return {
      current: approvedCount,
      max,
      isFull: approvedCount >= max,
    };
  };

  // Kiểm tra xem có thể duyệt thêm SV cho đề tài này không
  const canApproveMore = (topicId: number): boolean => {
    const { isFull } = getTopicEnrollment(topicId);
    return !isFull;
  };

  const columns: Column<PendingRequest>[] = [
    {
      id: "studentName",
      label: "Tên sinh viên",
      minWidth: 180,
      format: (_, row) => (
        <span style={{ fontWeight: 500 }}>{row.studentName}</span>
      ),
    },
    {
      id: "studentCode",
      label: "Mã sinh viên",
      minWidth: 130,
    },
    {
      id: "topicName",
      label: "Tên đề tài",
      minWidth: 250,
    },
    {
      id: "requestedAt",
      label: "Ngày gửi",
      minWidth: 110,
      format: (val) => {
        const date = new Date(val as string);
        return date.toLocaleDateString("vi-VN");
      },
    },
  ];

  const actions: Action<PendingRequest>[] = [
    {
      id: "approve",
      icon: <CheckIcon fontSize="small" />,
      label: "Duyệt",
      color: "primary" as const,
      onClick: (row) => onApprove(row),
    },
    {
      id: "reject",
      icon: <CloseIcon fontSize="small" />,
      label: "Từ chối",
      color: "error" as const,
      onClick: (row) => onReject(row),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={requests}
      rowKey="id"
      actions={actions}
      loading={loading}
      emptyMessage="Không có yêu cầu nào chờ duyệt"
      showExportButton={false}
      showImportButton={false}
      showFilterButton={false}
      showSearchInput={false}
    />
  );
}
