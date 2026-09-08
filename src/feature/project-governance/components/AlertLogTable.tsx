"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { DataTable, type Column } from "@/shared/components";
import {
  ALERT_EVENT_LABELS,
  ALERT_STATUS_COLORS,
  ALERT_STATUS_LABELS,
  DEADLINE_TYPE_LABELS,
  RECIPIENT_ROLE_LABELS,
} from "../constants";
import { adminConfigService } from "../services/adminConfig.service";
import type { AlertLogItem, ListAlertLogsParams } from "../types";
import { errorMessage, formatDateTime } from "../utils/governance";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { toast } from "sonner";

interface AlertLogTableProps {
  periodId: number;
  /** Tăng giá trị này để buộc bảng tải lại (sau khi gửi email hoặc lưu cấu hình). */
  refreshKey?: number;
}

export function AlertLogTable({
  periodId,
  refreshKey = 0,
}: AlertLogTableProps) {
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search, 450);
  const [rows, setRows] = useState<AlertLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const requestIdRef = useRef(0);
  const previousFilterKeyRef = useRef(`${periodId}:${debounced}`);

  const fetch = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const response = await adminConfigService.listAlertLogs({
        periodId,
        search: debounced.trim() || undefined,
        page: page + 1,
        limit: rowsPerPage,
      } satisfies ListAlertLogsParams);
      if (requestId !== requestIdRef.current) return;
      setRows(response.items ?? []);
      setTotal(response.total ?? 0);
    } catch (error) {
      if (requestId === requestIdRef.current) {
        toast.error(errorMessage(error, "Không thể tải lịch sử gửi email."));
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [debounced, page, periodId, rowsPerPage]);

  useEffect(() => {
    const filterKey = `${periodId}:${debounced}`;
    if (previousFilterKeyRef.current !== filterKey && page !== 0) {
      previousFilterKeyRef.current = filterKey;
      setPage(0);
      return;
    }
    previousFilterKeyRef.current = filterKey;
    fetch();
  }, [debounced, fetch, page, periodId, refreshKey]);

  const columns: Column<AlertLogItem>[] = [
    {
      id: "deadline",
      label: "Thời hạn",
      minWidth: 220,
      sortable: false,
      format: (_, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.deadline.label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {DEADLINE_TYPE_LABELS[row.deadline.type] ?? row.deadline.type}
            {row.deadline.seq > 1 ? ` · mốc ${row.deadline.seq}` : ""} ·{" "}
            {formatDateTime(row.deadline.deadline_at)}
          </Typography>
        </Box>
      ),
    },
    {
      id: "event",
      label: "Sự kiện",
      minWidth: 130,
      sortable: false,
      format: (value) =>
        ALERT_EVENT_LABELS[value as AlertLogItem["event"]] ?? String(value),
    },
    {
      id: "recipient_role",
      label: "Người nhận",
      minWidth: 200,
      sortable: false,
      format: (_, row) => (
        <Box>
          <Typography variant="body2">
            {RECIPIENT_ROLE_LABELS[row.recipient_role] ?? row.recipient_role}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.recipient_email}
          </Typography>
        </Box>
      ),
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 120,
      sortable: false,
      format: (value) => (
        <Chip
          size="small"
          label={
            ALERT_STATUS_LABELS[value as AlertLogItem["status"]] ??
            String(value)
          }
          color={
            ALERT_STATUS_COLORS[value as AlertLogItem["status"]] ?? "default"
          }
        />
      ),
    },
    {
      id: "attempt_count",
      label: "Số lần gửi",
      minWidth: 100,
      align: "center",
      sortable: false,
    },
    {
      id: "updated_at",
      label: "Cập nhật",
      minWidth: 160,
      sortable: false,
      format: (value) => formatDateTime(value as string),
    },
    {
      id: "error",
      label: "Lỗi",
      minWidth: 220,
      sortable: false,
      format: (value) =>
        value ? (
          <Typography
            variant="caption"
            color="error"
            sx={{
              display: "block",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {String(value)}
          </Typography>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <DataTable<AlertLogItem>
      columns={columns}
      rows={rows}
      rowKey="id"
      totalCount={total}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={setPage}
      onRowsPerPageChange={(value) => {
        setRowsPerPage(value);
        setPage(0);
      }}
      loading={loading}
      emptyMessage="Chưa có email nhắc hạn nào cho đợt này."
      showExportButton={false}
      showImportButton={false}
      showSearchInput
      searchValue={search}
      onSearchChange={setSearch}
      headerActions={[
        {
          id: "refresh-alert-log",
          label: "Làm mới",
          onClick: fetch,
          variant: "outlined",
          disabled: loading,
        },
      ]}
    />
  );
}
