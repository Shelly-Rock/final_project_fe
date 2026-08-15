"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import { Printer, Eye } from "lucide-react";
import { DataTable, Badge } from "@/shared/components";
import type { Column } from "@/shared/components";
import type { RegistrationRequest } from "../types";

interface RegistrationHistoryTableProps {
  registrations: RegistrationRequest[];
  loading?: boolean;
  onPrintConfirmation: (registration: RegistrationRequest) => void;
  onViewDetail: (registration: RegistrationRequest) => void;
}

const statusConfig = {
  Pending: { label: "Chờ duyệt", color: "warning" as const },
  Approved: { label: "Đã duyệt", color: "success" as const },
  Rejected: { label: "Từ chối", color: "error" as const },
};

export function RegistrationHistoryTable({
  registrations,
  loading = false,
  onPrintConfirmation,
  onViewDetail,
}: RegistrationHistoryTableProps) {
  const columns: Column<RegistrationRequest>[] = [
    {
      id: "topicName",
      label: "Tên đề tài",
      minWidth: 280,
      format: (_, row) => (
        <span style={{ fontWeight: 500 }}>{row.topicName}</span>
      ),
    },
    {
      id: "teacherName",
      label: "Giảng viên",
      minWidth: 160,
      format: (val) => (
        <span style={{ color: "#2563eb" }}>{val as string}</span>
      ),
    },
    {
      id: "requestedAt",
      label: "Thời gian gửi",
      minWidth: 140,
      format: (val) => {
        const date = new Date(val as string);
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 120,
      align: "center",
      format: (val) => {
        const config = statusConfig[val as keyof typeof statusConfig];
        return config ? (
          <Badge label={config.label} color={config.color} variant="soft" />
        ) : (
          <Badge label={String(val)} color="default" variant="soft" />
        );
      },
    },
    {
      id: "actions",
      label: "Hành động",
      minWidth: 150,
      align: "center",
      sortable: false,
      format: (_, row) => (
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
          <Tooltip title="Xem chi tiết" arrow>
            <IconButton
              size="small"
              onClick={() => onViewDetail(row)}
              sx={{
                color: "#2563eb",
                "& svg": {
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 2,
                },
              }}
            >
              <Eye size={18} />
            </IconButton>
          </Tooltip>
          {row.status === "Approved" && (
            <Tooltip title="In phiếu xác nhận" arrow>
              <IconButton
                size="small"
                onClick={() => onPrintConfirmation(row)}
                sx={{
                  color: "#22c55e",
                  "& svg": {
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 2,
                  },
                }}
              >
                <Printer size={18} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={registrations}
      rowKey="id"
      loading={loading}
      emptyMessage="Bạn chưa có yêu cầu đăng ký nào"
      showSearchInput={false}
      showExportButton={false}
      showImportButton={false}
      showFilterButton={false}
    />
  );
}
