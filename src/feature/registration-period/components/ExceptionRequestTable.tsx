"use client";

import { Box } from "@mui/material";
import { Check, X } from "lucide-react";
import { DataTable } from "@/shared/components";
import { Badge } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { ExceptionRequest } from "../types";

interface ExceptionRequestTableProps {
  requests: ExceptionRequest[];
  loading?: boolean;
  onApprove: (requestId: number) => Promise<void>;
  onReject: (requestId: number, reason: string) => Promise<void>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ExceptionRequestTable({
  requests,
  loading = false,
  onApprove,
  onReject,
}: ExceptionRequestTableProps) {
  const columns: Column<ExceptionRequest>[] = [
    {
      id: "topicName",
      label: "Tên đề tài ngoại lệ",
      minWidth: 250,
      format: (_, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.topicName}</div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "#f59e0b",
              marginTop: 2,
            }}
          >
            {row.maxStudents} sinh viên (vượt quá giới hạn)
          </div>
        </div>
      ),
    },
    {
      id: "teacherName",
      label: "Giảng viên đề xuất",
      minWidth: 150,
    },
    {
      id: "students",
      label: "Sinh viên chỉ định (Order)",
      minWidth: 200,
      sortable: false,
      format: (_, row) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {row.students.map((student) => (
            <Box
              key={student.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "0.875rem",
              }}
            >
              <Badge
                label={`#${student.order}`}
                color="default"
                variant="soft"
              />
              <span>{student.studentName}</span>
              <span style={{ color: "#64748b", fontSize: "0.75rem" }}>
                ({student.studentCode})
              </span>
            </Box>
          ))}
        </Box>
      ),
    },
    {
      id: "requestedAt",
      label: "Ngày đề xuất",
      minWidth: 120,
      format: (val) => formatDate(val as string),
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 100,
      align: "center",
      format: (val) => {
        const config = {
          pending: { label: "Chờ duyệt", color: "warning" as const },
          approved: { label: "Đã duyệt", color: "success" as const },
          rejected: { label: "Từ chối", color: "error" as const },
        };
        const c = config[val as keyof typeof config];
        return <Badge label={c.label} color={c.color} variant="soft" />;
      },
    },
  ];

  const actions: Action<ExceptionRequest>[] = [
    {
      id: "approve",
      icon: <Check size={18} />,
      label: "Duyệt",
      color: "primary",
      onClick: (row) => onApprove(row.id),
    },
    {
      id: "reject",
      icon: <X size={18} />,
      label: "Từ chối",
      color: "error",
      onClick: async (row) => {
        const reason = window.prompt("Nhập lý do từ chối:");
        if (reason) {
          await onReject(row.id, reason);
        }
      },
    },
  ];

  return (
    <Box>
      <DataTable
        columns={columns}
        rows={requests}
        rowKey="id"
        actions={actions}
        loading={loading}
        emptyMessage="Không có yêu cầu ngoại lệ nào"
        showImportButton={false}
      />
    </Box>
  );
}
