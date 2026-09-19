"use client";

import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import { Tooltip, Typography, Box } from "@mui/material";
import { DataTable } from "@/shared/components";
import type { Column, Action } from "@/shared/components";
import type { PendingRequest, MyTopic } from "../types";

interface PendingRequestTableProps {
  requests: PendingRequest[];
  loading?: boolean;
  onApprove: (request: PendingRequest) => void;
  onReject: (request: PendingRequest) => void;
}

export function PendingRequestTable({
  requests,
  loading = false,
  onApprove,
  onReject,
}: PendingRequestTableProps) {
  const columns: Column<PendingRequest>[] = [
    {
      id: "studentName",
      label: "Tên sinh viên",
      minWidth: 180,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.studentName}
          </Typography>
          {row.studentMessage && (
            <Tooltip title={row.studentMessage} placement="top" arrow>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontStyle: "italic",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                }}
              >
                {row.studentMessage}
              </Typography>
            </Tooltip>
          )}
        </Box>
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
