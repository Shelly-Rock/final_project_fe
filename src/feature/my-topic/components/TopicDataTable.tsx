"use client";

import { useState } from "react";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { RefreshCw, Plus, AlertTriangle, Lock, Unlock } from "lucide-react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { DataTable } from "@/shared/components";
import { Badge } from "@/shared/components";
import type { Column, Action, HeaderAction } from "@/shared/components";
import type { MyTopic } from "../types";

interface TopicDataTableProps {
  topics: MyTopic[];
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onEdit: (topic: MyTopic) => void;
  onDelete: (topic: MyTopic) => void;
  onCreate: () => void;
  onCreateException: () => void;
  onRefresh: () => void;
  onToggleLock?: (topic: MyTopic) => void;
}

const statusConfig: Record<
  string,
  { label: string; color: "success" | "warning" | "error" | "default" | "info" }
> = {
  Draft: { label: "Nháp", color: "default" },
  Pending: { label: "Chờ duyệt", color: "warning" },
  Approved: { label: "Đã duyệt", color: "success" },
  Rejected: { label: "Từ chối", color: "error" },
  Waiting_For_Secretary: { label: "Chờ Thư ký", color: "info" },
};

// Trạng thái đăng ký
const registrationStatusConfig = {
  OPEN: { label: "Mở", bgColor: "#dcfce7", textColor: "#166534" },
  FULL: { label: "Đã đầy", bgColor: "#fef3c7", textColor: "#92400e" },
  LOCKED: { label: "Đã chốt", bgColor: "#f3f4f6", textColor: "#6b7280" },
};

export function TopicDataTable({
  topics,
  loading = false,
  searchValue = "",
  onSearchChange,
  onEdit,
  onDelete,
  onCreate,
  onCreateException,
  onRefresh,
  onToggleLock,
}: TopicDataTableProps) {
  // Confirmation modal state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    topic: MyTopic | null;
  }>({ open: false, topic: null });

  // Handle lock button click
  const handleLockClick = (topic: MyTopic) => {
    setConfirmDialog({ open: true, topic });
  };

  // Confirm lock
  const handleConfirmLock = () => {
    if (confirmDialog.topic && onToggleLock) {
      onToggleLock(confirmDialog.topic);
    }
    setConfirmDialog({ open: false, topic: null });
  };

  // Cancel lock
  const handleCancelLock = () => {
    setConfirmDialog({ open: false, topic: null });
  };
  const headerActions: HeaderAction[] = [
    {
      id: "refresh",
      icon: <RefreshCw size={16} />,
      label: "Làm mới",
      onClick: onRefresh,
      variant: "outlined",
    },
    {
      id: "exception",
      icon: <AlertTriangle size={16} />,
      label: "Đề xuất ngoại lệ",
      onClick: onCreateException,
      variant: "outlined",
      color: "secondary",
    },
    {
      id: "add",
      icon: <Plus size={16} />,
      label: "Thêm đề tài",
      onClick: onCreate,
      variant: "contained",
    },
  ];
  const columns: Column<MyTopic>[] = [
    {
      id: "name",
      label: "Tên đề tài",
      minWidth: 250,
      format: (_, row) => <span style={{ fontWeight: 500 }}>{row.name}</span>,
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 120,
      align: "center",
      sortable: false,
      format: (val) => {
        const config = statusConfig[val as string];
        return config ? (
          <Badge label={config.label} color={config.color} variant="soft" />
        ) : (
          <Badge label={String(val)} color="default" variant="soft" />
        );
      },
    },
    {
      id: "enrollment",
      label: "Sĩ số",
      minWidth: 100,
      align: "center",
      format: (_, row) => {
        const approvedCount =
          row.registeredStudents?.filter((s) => s.status === "Approved")
            .length || 0;
        const maxStudents = row.maxStudents;
        const isFull = approvedCount >= maxStudents;
        return (
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontWeight: isFull ? 600 : 500,
              bgcolor: isFull ? "#fee2e2" : "#dcfce7",
              color: isFull ? "#dc2626" : "#166534",
              fontSize: "0.8rem",
            }}
          >
            {approvedCount}/{maxStudents}
          </Box>
        );
      },
    },
    {
      id: "registrationStatus",
      label: "Đăng ký",
      minWidth: 110,
      align: "center",
      format: (_, row) => (
        <Box
          component="span"
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
            fontWeight: 600,
            bgcolor:
              registrationStatusConfig[row.registrationStatus]?.bgColor ||
              "#f3f4f6",
            color:
              registrationStatusConfig[row.registrationStatus]?.textColor ||
              "#6b7280",
          }}
        >
          {registrationStatusConfig[row.registrationStatus]?.label || "Mở"}
        </Box>
      ),
    },
    {
      id: "createdAt",
      label: "Ngày tạo",
      minWidth: 110,
      format: (val) => {
        const date = new Date(val as string);
        return date.toLocaleDateString("vi-VN");
      },
    },
  ];

  const actions: Action<MyTopic>[] = [
    {
      id: "edit",
      icon: <EditIcon fontSize="small" />,
      label: "Sửa",
      color: "primary" as const,
      onClick: (row) => onEdit(row),
    },
    {
      id: "lock",
      icon: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {row.registrationStatus === "LOCKED" ? (
            <Unlock size={16} />
          ) : (
            <Lock size={16} />
          )}
        </Box>
      ),
      label: (row) =>
        row.registrationStatus === "LOCKED" ? "Mở khóa" : "Khóa",
      color: (row) =>
        (row.registrationStatus === "LOCKED" ? "success" : "warning") as
          | "success"
          | "warning",
      onClick: (row) => {
        if (row.registrationStatus === "LOCKED") {
          // Mở khóa trực tiếp
          if (onToggleLock) onToggleLock(row);
        } else {
          // Khóa - hiện confirmation
          handleLockClick(row);
        }
      },
    },
    {
      id: "delete",
      icon: <DeleteIcon fontSize="small" />,
      label: "Xóa",
      color: "error" as const,
      onClick: (row) => onDelete(row),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={topics}
        rowKey="id"
        actions={actions}
        headerActions={headerActions}
        loading={loading}
        emptyMessage="Chưa có đề tài nào"
        showSearchInput
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        showExportButton={false}
        showImportButton={false}
        showFilterButton={false}
      />

      {/* Confirmation Dialog for Lock */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelLock}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: 700,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "calc(100vh - 64px)",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Lock size={24} color="#f59e0b" />
          Xác nhận khóa đề tài
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Đề tài <strong>&quot;{confirmDialog.topic?.name}&quot;</strong> đang
            có{" "}
            <strong>
              {confirmDialog.topic?.registeredStudents?.filter(
                (s) => s.status === "Approved",
              ).length || 0}
              /{confirmDialog.topic?.maxStudents}
            </strong>{" "}
            sinh viên đăng ký.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nếu khóa, các sinh viên khác sẽ không thể tiếp tục đăng ký đề tài
            này. Bạn có chắc chắn muốn khóa đề tài này?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={handleCancelLock}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleConfirmLock}
            startIcon={<Lock size={18} />}
          >
            Xác nhận khóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
