"use client";

import { Bell, Settings2 } from "lucide-react";
import { DataTable } from "@/shared/components";
import { Badge } from "@/shared/components";
import type { Column, Action, HeaderAction } from "@/shared/components";
import type { TeacherQuota } from "../types";

interface TeacherQuotaTableProps {
  quotas: TeacherQuota[];
  loading?: boolean;
  onAdjustQuota: (quota: TeacherQuota) => void;
  onRemindAll: () => void;
}

const statusConfig = {
  sufficient: { label: "Hoàn thàn", color: "success" as const },
  insufficient: { label: "Chưa hoàn tành", color: "error" as const },
};

export function TeacherQuotaTable({
  quotas,
  loading = false,
  onAdjustQuota,
  onRemindAll,
}: TeacherQuotaTableProps) {
  const insufficientCount = quotas.filter(
    (q) => q.status === "insufficient",
  ).length;

  const columns: Column<TeacherQuota>[] = [
    {
      id: "teacherName",
      label: "Giảng viên",
      minWidth: 180,
      format: (_, row) => (
        <span style={{ fontWeight: 500 }}>{row.teacherName}</span>
      ),
    },
    {
      id: "department",
      label: "Khoa",
      minWidth: 150,
    },
    {
      id: "assignedQuota",
      label: "Chỉ tiêu",
      minWidth: 80,
      align: "center",
    },
    {
      id: "submittedTopics",
      label: "Đã nộp",
      minWidth: 80,
      align: "center",
      format: (val, row) => {
        const quota = row.assignedQuota;
        const submitted = val as number;
        return (
          <span
            style={{
              color: submitted >= quota ? "#22c55e" : "#ef4444",
              fontWeight: 600,
            }}
          >
            {submitted}
          </span>
        );
      },
    },
    {
      id: "progress",
      label: "Tiến độ",
      minWidth: 150,
      align: "center",
      sortable: false,
      format: (_, row) => {
        const percentage = Math.min(
          (row.submittedTopics / row.assignedQuota) * 100,
          100,
        );
        const isComplete = row.submittedTopics >= row.assignedQuota;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                flex: 1,
                height: 8,
                backgroundColor: "#e5e7eb",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  backgroundColor: isComplete ? "#22c55e" : "#f97316",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <span
              style={{ fontSize: "0.75rem", color: "#64748b", minWidth: 35 }}
            >
              {row.submittedTopics}/{row.assignedQuota}
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 90,
      align: "center",
      format: (val) => {
        const config = statusConfig[val as keyof typeof statusConfig];
        return (
          <Badge label={config.label} color={config.color} variant="soft" />
        );
      },
    },
  ];

  const actions: Action<TeacherQuota>[] = [
    {
      id: "adjust",
      icon: <Settings2 size={18} />,
      label: "Điều chỉnh chỉ tiêu",
      color: "primary",
      onClick: (row) => onAdjustQuota(row),
    },
  ];

  const headerActions: HeaderAction[] = [
    {
      id: "remind",
      icon: <Bell size={18} />,
      label:
        insufficientCount > 0
          ? `Nhắc nhở (${insufficientCount})`
          : "Nhắc nhở hàng loạt",
      onClick: onRemindAll,
      variant: insufficientCount > 0 ? "contained" : "outlined",
    },
  ];

  return (
    <div>
      {insufficientCount > 0 && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fef3c7",
            border: "1px solid #fcd34d",
            borderRadius: 8,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>⚠️</span>
          <span style={{ color: "#92400e" }}>
            Có <strong>{insufficientCount}</strong> giảng viên chưa hoàn thành
            chỉ tiêu. Nhấn &quot;Nhắc nhở&quot; để gửi email thông báo.
          </span>
        </div>
      )}

      <DataTable
        columns={columns}
        rows={quotas}
        rowKey="id"
        actions={actions}
        headerActions={headerActions}
        loading={loading}
        emptyMessage="Chưa có giảng viên nào được phân công"
        showImportButton={false}
      />
    </div>
  );
}
